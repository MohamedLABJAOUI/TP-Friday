const Order = require('../models/Order');
const axios = require('axios');
const { publishToQueue } = require('../rabbitmq');

const orderController = {
  // Créer une nouvelle commande
  createOrder: async (req, res) => {
    try {
      const { products, shippingAddress } = req.body;
      const userId = req.user.id;

      console.log('Création de commande - Données reçues:', {
        userId,
        products,
        shippingAddress
      });

      if (!products || !Array.isArray(products) || products.length === 0) {
        return res.status(400).json({ 
          message: 'La liste des produits est requise et ne peut pas être vide' 
        });
      }

      if (!shippingAddress) {
        return res.status(400).json({ 
          message: 'L\'adresse de livraison est requise' 
        });
      }

      // Vérifier la disponibilité des produits
      console.log('Vérification des produits avec le service produits...');
      const productPromises = products.map(async (item) => {
        try {
          const response = await axios.get(
            `${process.env.PRODUCT_SERVICE_URL}/api/products/${item.productId}`,
            {
              headers: { 
                Authorization: `Bearer ${req.headers.authorization}` 
              }
            }
          );
          return response.data;
        } catch (error) {
          console.error(`Erreur lors de la récupération du produit ${item.productId}:`, error.message);
          throw new Error(`Produit non trouvé: ${item.productId}`);
        }
      });

      const productDetails = await Promise.all(productPromises);
      console.log('Détails des produits récupérés:', productDetails);

      // Calculer le montant total
      const totalAmount = products.reduce((total, item, index) => {
        return total + (item.quantity * productDetails[index].price);
      }, 0);

      console.log('Montant total calculé:', totalAmount);

      const order = new Order({
        userId,
        products: products.map((item, index) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: productDetails[index].price
        })),
        totalAmount,
        shippingAddress
      });

      console.log('Sauvegarde de la commande...');
      await order.save();
      console.log('Commande sauvegardée avec succès:', order._id);

      // Notify via RabbitMQ
      await publishToQueue('order_created', {
        orderId: order._id,
        userId: order.userId,
        total: order.totalAmount,
        products: order.products,
        shippingAddress: order.shippingAddress
      });

      res.status(201).json(order);
    } catch (error) {
      console.error('Erreur lors de la création de la commande:', error);
      if (error.message.includes('Produit non trouvé')) {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ 
        message: 'Erreur lors de la création de la commande',
        error: error.message 
      });
    }
  },

  // Obtenir toutes les commandes d'un utilisateur
  getUserOrders: async (req, res) => {
    try {
      const userId = req.user.id;
      const orders = await Order.find({ userId });
      res.json(orders);
    } catch (error) {
      console.error('Erreur lors de la récupération des commandes:', error);
      res.status(500).json({ message: error.message });
    }
  },

  // Obtenir une commande spécifique
  getOrder: async (req, res) => {
    try {
      const order = await Order.findById(req.params.id);
      if (!order) {
        return res.status(404).json({ message: 'Commande non trouvée' });
      }
      res.json(order);
    } catch (error) {
      console.error('Erreur lors de la récupération de la commande:', error);
      res.status(500).json({ message: error.message });
    }
  },

  // Mettre à jour le statut d'une commande
  updateOrderStatus: async (req, res) => {
    try {
      const { status } = req.body;
      const order = await Order.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      );
      if (!order) {
        return res.status(404).json({ message: 'Commande non trouvée' });
      }
      res.json(order);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      res.status(500).json({ message: error.message });
    }
  },

  // Annuler une commande
  cancelOrder: async (req, res) => {
    try {
      const order = await Order.findByIdAndUpdate(
        req.params.id,
        { status: 'cancelled' },
        { new: true }
      );
      if (!order) {
        return res.status(404).json({ message: 'Commande non trouvée' });
      }
      res.json(order);
    } catch (error) {
      console.error('Erreur lors de l\'annulation de la commande:', error);
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = orderController; 