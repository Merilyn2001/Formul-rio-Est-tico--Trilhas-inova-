const formLogin = document.getElementById('form-login');
const loginIdUsuarioInput = document.getElementById('loginIdUsuario');
const loginSenhaInput = document.getElementById('loginSenha');
const mensagemErroLogin = document.getElementById('mensagem-erro-login');
const mensagemErroTexto = document.getElementById('mensagem-erro-texto');

// Máscara para CPF no campo ID do Usuário
loginIdUsuarioInput.addEventListener('input', function() {
    let value = loginIdUsuarioInput.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    loginIdUsuarioInput.value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
});

// Adicionar depuração para verificar se os elementos foram encontrados
console.log('mensagemErroLogin:', mensagemErroLogin);
console.log('mensagemErroTexto:', mensagemErroTexto);

// Proteger a rota: se o usuário estiver logado, redireciona para index.html (formulário)
window.onload = function() {
    if (isLoggedIn()) {
        window.location.href = 'index.html'; // Redireciona para o formulário se já estiver logado
    }
};

// Função para exibir mensagens de erro nos campos
function exibirMensagemErro(campo, mensagem) {
    const erroElement = document.getElementById(`erro-${campo.id}`);
    if (erroElement) {
        erroElement.textContent = mensagem;
        erroElement.classList.add('ativo');
        campo.classList.add('input-invalido');
    }
}

// Função para limpar mensagens de erro nos campos
function limparMensagemErro(campo) {
    const erroElement = document.getElementById(`erro-${campo.id}`);
    if (erroElement) {
        erroElement.textContent = '';
        erroElement.classList.remove('ativo');
        campo.classList.remove('input-invalido');
    }
}

// Função para exibir mensagem de erro geral
function exibirMensagemErroGeral(mensagem) {
    if (mensagemErroTexto && mensagemErroLogin) {
        mensagemErroTexto.textContent = mensagem;
        mensagemErroLogin.style.display = 'block';
    } else {
        console.error('Elementos de mensagem de erro não encontrados.');
    }
}

// Função para limpar mensagem de erro geral
function limparMensagemErroGeral() {
    if (mensagemErroTexto && mensagemErroLogin) {
        mensagemErroTexto.textContent = '';
        mensagemErroLogin.style.display = 'none';
    } else {
        console.error('Elementos de mensagem de erro não encontrados.');
    }
}

// Função para validar o login
function validarLogin() {
    let loginValido = true;

    // Limpar mensagens de erro anteriores
    limparMensagemErro(loginIdUsuarioInput);
    limparMensagemErro(loginSenhaInput);
    limparMensagemErroGeral();

    // Verificar se os campos estão preenchidos
    if (!loginIdUsuarioInput.value.trim()) {
        exibirMensagemErro(loginIdUsuarioInput, 'O campo ID do Usuário (CPF) é obrigatório.');
        loginValido = false;   
    } else if (!validarCPF(loginIdUsuarioInput.value.replace(/\D/g, ''))) { // Adicionado
        exibirMensagemErro(loginIdUsuarioInput, 'Digite um CPF válido.');
        loginValido = false;
    }
    if (!loginSenhaInput.value.trim()) {
        exibirMensagemErro(loginSenhaInput, 'O campo Senha é obrigatório.');
        loginValido = false;
    }

    // Se os campos estiverem preenchidos, verificar as credenciais
    if (loginValido) {
        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        const usuarioEncontrado = usuarios.find(
            usuario => usuario.idUsuario === loginIdUsuarioInput.value && usuario.senha === loginSenhaInput.value
        );

        if (!usuarioEncontrado) {
            exibirMensagemErro(loginIdUsuarioInput, 'ID do Usuário (CPF) ou senha incorretos.');
            exibirMensagemErro(loginSenhaInput, 'ID do Usuário (CPF) ou senha incorretos.');
            exibirMensagemErroGeral('ID do Usuário (CPF) ou senha incorretos. Tente novamente.');
            loginValido = false;
        }
    }

    return loginValido;
}

// Evento de submissão do formulário de login
if (formLogin) {
    formLogin.addEventListener('submit', function(event) {
        event.preventDefault();

        if (validarLogin()) {
            login(); // Marca o usuário como logado
            console.log('Após login - isLoggedIn:', isLoggedIn()); // Depuração
            window.location.href = 'index.html'; // Redireciona para o formulário
        }
    });
}

//Função para validar cpf do ID do usuario
function validarCPF(cpf) {
    if (!cpf || cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
    let sum = 0;
    for (let i = 0; i < 9; i++) sum += parseInt(cpf.charAt(i)) * (10 - i);
    let remainder = 11 - (sum % 11);
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(9))) return false;
    sum = 0;
    for (let i = 0; i < 10; i++) sum += parseInt(cpf.charAt(i)) * (11 - i);
    remainder = 11 - (sum % 11);
    if (remainder === 10 || remainder === 11) remainder = 0;
    return remainder === parseInt(cpf.charAt(10));
}