// auth.js

// Função para verificar se o usuário está logado
function isLoggedIn() {
    return localStorage.getItem('isLoggedIn') === 'true';
}

// Função para fazer login
function login() {
    localStorage.setItem('isLoggedIn', 'true');
}

// Função para fazer logout
function logout() {
    localStorage.removeItem('isLoggedIn');
    window.location.href = 'login.html';
}