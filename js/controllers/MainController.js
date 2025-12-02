// js/controllers/MainController.js
(function() {
    'use strict';

    angular
        .module('tiendaApp')
        .controller('MainController', MainController);

    MainController.$inject = ['$scope', 'ProductService'];

    function MainController($scope, ProductService) {

        // ================================
        // VARIABLES PRINCIPALES
        // ================================
        $scope.allProducts = [];       // Todos los productos desde la API
        $scope.displayProducts = [];   // Productos filtrados que se muestran
        $scope.cart = [];              // Carrito
        $scope.cartTotal = 0;          // Total del carrito

        // Categorías (Persona 3)
        $scope.categories = [];
        $scope.selectedCategory = "";  // valor actual del dropdown
        $scope.searchText = "";        // texto de búsqueda

        // Modales (Persona 4)
        $scope.showDetailsModal = false;
        $scope.showCartModal = false;
        $scope.selectedProduct = null;

        // ================================
        // FUNCIONES AUXILIARES
        // ================================

        // Obtener categorías únicas desde los productos
        function getUniqueCategories(products) {
            var set = new Set();
            products.forEach(function(p) {
                if (p.category) {
                    set.add(p.category);
                }
            });
            return Array.from(set);
        }

        // Calcular total del carrito (Persona 5)
        function calculateTotal(cart) {
            var total = 0;
            cart.forEach(function(item) {
                total += item.price * item.quantity;
            });
            return total;
        }

        // ================================
        // CARGA INICIAL DE DATOS
        // ================================

        // 1. Obtener productos de la API
        ProductService.getAllProducts().then(function(products) {
            $scope.allProducts = products;
            $scope.displayProducts = products;

            // Extraer categorías (Persona 3)
            $scope.categories = getUniqueCategories(products);

            console.log("Productos cargados:", products.length);
            console.log("Categorías:", $scope.categories);
        });

        // 2. Cargar carrito desde localStorage
        $scope.cart = ProductService.getCart() || [];
        $scope.cartTotal = calculateTotal($scope.cart);

        // ================================
        // LÓGICA DE FILTROS 
        // ================================

        // Se llama cuando cambia el dropdown
        $scope.filterByCategory = function() {
            $scope.applyFilters();
        };

        // Aplica combinación de filtros:
        // categoría + búsqueda por nombre
        $scope.applyFilters = function() {
            var list = $scope.allProducts;

            // Filtro por categoría
            if ($scope.selectedCategory && $scope.selectedCategory !== "") {
                list = list.filter(function(p) {
                    return p.category === $scope.selectedCategory;
                });
            }

            // Filtro por texto (título)
            if ($scope.searchText && $scope.searchText.trim() !== "") {
                var text = $scope.searchText.toLowerCase();
                list = list.filter(function(p) {
                    return p.title.toLowerCase().indexOf(text) !== -1;
                });
            }

            $scope.displayProducts = list;
        };

        // ================================
        // DETALLES DEL PRODUCTO
        // ================================

        $scope.openDetails = function(product) {
            $scope.selectedProduct = product;
            $scope.showDetailsModal = true;
        };

        // ================================
        // CARRITO (PERSONAS 4 y 5)
        // ================================

        // Abrir modal del carrito (tu HTML llama a openCartModal)
        $scope.openCartModal = function() {
            $scope.cartTotal = calculateTotal($scope.cart);
            $scope.showCartModal = true;
        };

        // Agregar producto al carrito
        $scope.updateCart = function(product) {

            // Buscamos si el producto ya está en el carrito
            var item = $scope.cart.find(function(p) {
                return p.id === product.id;
            });

            if (item) {
                item.quantity++;
            } else {
                $scope.cart.push({
                    id: product.id,
                    title: product.title,      // IMPORTANTE: tu HTML muestra item.title
                    price: product.price,
                    quantity: 1
                });
            }

            // Guardar en localStorage
            ProductService.saveCart($scope.cart);

            // Recalcular total
            $scope.cartTotal = calculateTotal($scope.cart);
        };

        // Cerrar modales (detalles y carrito)
        $scope.closeModals = function() {
            $scope.showDetailsModal = false;
            $scope.showCartModal = false;
        };
    }

})();
