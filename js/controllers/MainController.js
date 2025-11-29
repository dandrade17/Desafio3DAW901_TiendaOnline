// js/controllers/MainController.js
(function() {
    'use strict';
    
    angular
        .module('tiendaApp')
        .controller('MainController', MainController);

    // Inyección de dependencias para el servicio creado
    MainController.$inject = ['$scope', 'ProductService']; 

    function MainController($scope, ProductService) {

        // Lista de todos los productos
        $scope.allProducts = []; 
        // Lista de productos que se mostrarán en pantalla (filtrados)
        $scope.displayProducts = []; 
        // Array del carrito de compras
        $scope.cart = [];
        // Monto total del carrito 
        $scope.cartTotal = 0; 

        // Lista de categorías únicas
        $scope.categories = []; 

        // Función auxiliar para extraer las categorías (Ayuda a Persona 3)
        function getUniqueCategories(products) {
            // Usamos un objeto Set para obtener elementos únicos de forma eficiente
            var categoriesSet = new Set();
            // Agregamos una opción "Todos" (o similar) para ver todos los productos
            categoriesSet.add('all'); 
            
            products.forEach(function(product) {
                if (product.category) {
                    // Agregar la categoría al Set
                    categoriesSet.add(product.category); 
                }
            });
            
            // Convertir el Set de vuelta a un array para usarlo en el DropDown de AngularJS
            return Array.from(categoriesSet);
        }

        // 1. Obtener productos de la API
        ProductService.getAllProducts().then(function(products) {
            $scope.allProducts = products;
            $scope.displayProducts = products;

            // **PASO CLAVE: EXTRAER CATEGORÍAS ÚNICAS**
            // Este array de categorías será usado por Persona 3 para el DropDown (Requisito 5a)
            $scope.categories = getUniqueCategories(products);
            
            // **VERIFICACIÓN:**
            console.log("Productos cargados exitosamente:", products.length);
            console.log("Categorías únicas:", $scope.categories);

        });

        // 2. Cargar carrito del localStorage (Requisito 57)
        $scope.cart = ProductService.getCart();
        // **PENDIENTE**: Aquí Persona 5 debe implementar la función de cálculo
        // $scope.cartTotal = calculateTotal($scope.cart); 

        // Función simulada para abrir el modal del carrito (Tarea de Persona 4)
        $scope.openCartModal = function() {
            // Lógica para abrir el modal de Carrito de Compra [cite: 56]
            console.log("Abrir modal del carrito. Total actual:", $scope.cartTotal);
        };
        
        // Función placeholder que será implementada por Persona 4
        $scope.updateCart = function(product) {
            // Lógica para agregar/actualizar producto en $scope.cart
            // Luego, guardar en localStorage
            ProductService.saveCart($scope.cart);
            // Luego, Persona 5 actualizará el total
            // $scope.cartTotal = calculateTotal($scope.cart); 
        };

        /*
        // Función de prueba para verificar que el localStorage funciona
        $scope.testLocalStorage = function() {
            console.log("--- TEST LOCAL STORAGE ---");
            
            // 1. Crear un producto de prueba
            var testProduct = { id: Date.now(), name: 'Test Item ' + Date.now(), price: 1.00 };

            // 2. Agregar al carrito y guardar
            $scope.cart.push(testProduct);
            ProductService.saveCart($scope.cart);
            
            console.log("Carrito guardado:", ProductService.getCart());
            
            // 3. Limpiar el carrito (prueba)
            // ProductService.clearCart();
            // console.log("Carrito después de limpiar:", ProductService.getCart());

            console.log("--- FIN TEST ---");
        };
        
        // Ejecuta la función de prueba para verificar
        $scope.testLocalStorage();
        */
    }
})();