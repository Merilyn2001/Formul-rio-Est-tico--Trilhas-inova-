const logoutBtn = document.getElementById('logout-btn');
const statusInscricao = document.getElementById('status-inscricao');
const fazerInscricaoBtn = document.getElementById('fazer-inscricao');
const alterarInscricaoBtn = document.getElementById('alterar-inscricao');
const novaInscricaoBtn = document.getElementById('nova-inscricao'); // Novo botão

// Exibir botões e mensagem condicionalmente
window.onload = function() {
    const inscricaoConcluida = localStorage.getItem('inscricaoConcluida') === 'true';
    const loggedIn = isLoggedIn();

    console.log('inscricaoConcluida:', inscricaoConcluida);
    console.log('isLoggedIn:', loggedIn);
    console.log('logoutBtn display:', loggedIn ? 'block' : 'none');

    if (inscricaoConcluida) {
        statusInscricao.textContent = 'Inscrição concluída com sucesso!';
        fazerInscricaoBtn.style.display = 'none';
        alterarInscricaoBtn.style.display = 'block';
        novaInscricaoBtn.style.display = 'block'; // Mostrar botão "Nova Inscrição"
        logoutBtn.style.display = loggedIn ? 'block' : 'none';
    } else {
        statusInscricao.textContent = 'Bem-vindo à inscrição do TRILHAS INOVA-MA.';
        fazerInscricaoBtn.style.display = 'block';
        alterarInscricaoBtn.style.display = 'none';
        novaInscricaoBtn.style.display = 'none'; // Esconder botão "Nova Inscrição"
        logoutBtn.style.display = 'none';
    }
};

// Evento de logout
if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
        logout(); // Faz logout e redireciona para login.html
    });
}

// Evento para nova inscrição
if (novaInscricaoBtn) {
    novaInscricaoBtn.addEventListener('click', function() {
        // Limpar dados do LocalStorage relacionados à inscrição
        localStorage.removeItem('inscricaoConcluida');
        localStorage.removeItem('dadosFormulario');
        localStorage.removeItem('usuarios');
        localStorage.removeItem('isLoggedIn'); // Também faz logout
        // Recarregar a página
        window.location.reload();
    });
}