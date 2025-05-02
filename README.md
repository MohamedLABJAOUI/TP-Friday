# 🔧 **Architecture du projet**
Notre projet est basé sur une architecture de microservices utilisant Docker. Il comprend un frontend en React, un backend Node.js + Express, RabbitMQ pour la messagerie asynchrone et Nginx comme proxy inverse.

## 🧱 **Composants**

### **Frontend (React)**
- Interface utilisateur pour les produits et les commandes

### **Backend (Node.js + Express)**
- **API REST** : `/api/produits`, `/api/commandes`
- Publie les commandes dans la file RabbitMQ

### **RabbitMQ**
- Met les commandes dans une file pour un traitement asynchrone
- Accessible via l'interface de gestion à l'adresse `port 15672`

### **Nginx**
- Sert de **proxy inverse** pour le frontend et le backend
- Disponible sur le port `80`

## 📦 **Pourquoi RabbitMQ ?**
Nous utilisons RabbitMQ pour simuler une communication découplée entre les services. Lorsqu'une commande est créée, elle est envoyée dans une file d'attente au lieu d'être traitée immédiatement. Ce modèle est utilisé dans les systèmes réels pour améliorer la **scalabilité**.

## 🐳 **Pourquoi Docker + docker-compose ?**
Docker nous permet d'isoler chaque partie de l'application. Avec **docker-compose**, nous pouvons démarrer l'ensemble (frontend, backend, messagerie, proxy) avec une seule commande.
