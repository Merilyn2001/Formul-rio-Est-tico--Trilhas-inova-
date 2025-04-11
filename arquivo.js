const formulario = document.getElementById('form');
const mensagemSucesso = document.getElementById('mensagem-sucesso');
const mensagemTexto = document.getElementById('mensagem-texto');
const okBtn = document.getElementById('ok-btn');

formulario.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        const inputs = Array.from(formulario.querySelectorAll('input, select, textarea'));
        const currentIndex = inputs.indexOf(document.activeElement);
        if (currentIndex < inputs.length - 1) {
            inputs[currentIndex + 1].focus();
        }
    }
});

const nomeInput = document.getElementById('nome');
const nascimentoInput = document.getElementById('nascimento');
const cpfInput = document.getElementById('cpf');
const sexoInput = document.getElementById('sexo');
const emailInput = document.getElementById('email');
const telefoneInput = document.getElementById('telefone');
const identidadeFile = document.getElementById('identidade');
const cepInput = document.getElementById('cep');
const ruaInput = document.getElementById('rua');
const numeroInput = document.getElementById('numero');
const cidadeInput = document.getElementById('cidade');
const estadoInput = document.getElementById('estado');
const residencialFile = document.getElementById('residencial');
const trilhasContainer = document.querySelector('.trilhas');
const radioTrilhas = document.querySelectorAll('input[name="trilha"]');
const checkboxDeclaracaoInput = document.getElementById('declaracao');
const idUsuarioInput = document.getElementById('idUsuario');
const senhaInput = document.getElementById('senha');
const botaoSalvar = document.querySelector('.save-btn');
const botaoCancelar = document.querySelector('.cancel-btn');
const botaoInscricao = document.querySelector('.submit-btn');

// Proteger a rota: se o usuário tiver inscrição concluída e não estiver logado, redireciona para login.html
window.onload = function() {
    const inscricaoConcluida = localStorage.getItem('inscricaoConcluida') === 'true';
    if (inscricaoConcluida && !isLoggedIn()) {
        window.location.href = 'login.html';
    }
    carregarDadosDoLocalStorage();
};

// Máscaras simples
cpfInput.addEventListener('input', function() {
    let value = cpfInput.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    cpfInput.value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    idUsuarioInput.value = cpfInput.value; // Copia o CPF para o ID do Usuário
});

telefoneInput.addEventListener('input', function() {
    let value = telefoneInput.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    telefoneInput.value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
});

cepInput.addEventListener('input', function() {
    let value = cepInput.value.replace(/\D/g, '');
    if (value.length > 8) value = value.slice(0, 8);
    cepInput.value = value.replace(/(\d{5})(\d{3})/, '$1-$2');
});

// Função para mostrar a mensagem de sucesso temporária
function mostrarMensagemSucesso(uploadContainer) {
    const mensagemSucesso = uploadContainer.querySelector('.upload-success');
    mensagemSucesso.style.display = 'block';
    mensagemSucesso.classList.add('active');
    setTimeout(() => {
        mensagemSucesso.classList.remove('active');
        setTimeout(() => {
            mensagemSucesso.style.display = 'none';
        }, 300); 
    }, 3000); 
}

// Feedback nos campos de upload
identidadeFile.addEventListener('change', function() {
    const uploadContainer = identidadeFile.closest('.upload-identidade');
    const span = uploadContainer.querySelector('.upload-text');
    if (identidadeFile.files[0]) {
        span.textContent = identidadeFile.files[0].name;
        span.classList.add('has-file'); // Adiciona a classe para o ícone de check
        mostrarMensagemSucesso(uploadContainer);
    } else {
        span.textContent = 'Clique aqui para selecionar o arquivo';
        span.classList.remove('has-file');
    }
    limparMensagemErro(identidadeFile);
});

residencialFile.addEventListener('change', function() {
    const uploadContainer = residencialFile.closest('.upload-residencia');
    const span = uploadContainer.querySelector('.upload-text');
    if (residencialFile.files[0]) {
        span.textContent = residencialFile.files[0].name;
        span.classList.add('has-file'); // Adiciona a classe para o ícone de check
        mostrarMensagemSucesso(uploadContainer);
    } else {
        span.textContent = 'Clique aqui para selecionar o arquivo';
        span.classList.remove('has-file');
    }
    limparMensagemErro(residencialFile);
});

// Função para coletar os dados do formulário
function coletarDadosFormulario() {
    return {
        nome: nomeInput.value,
        nascimento: nascimentoInput.value,
        cpf: cpfInput.value,
        sexo: sexoInput.value,
        email: emailInput.value,
        telefone: telefoneInput.value,
        identidadeNome: identidadeFile.files[0]?.name,
        cep: cepInput.value,
        rua: ruaInput.value,
        numero: numeroInput.value,
        cidade: cidadeInput.value,
        estado: estadoInput.value,
        residencialNome: residencialFile.files[0]?.name,
        trilhaSelecionada: document.querySelector('input[name="trilha"]:checked')?.value,
        declaracaoAceita: checkboxDeclaracaoInput.checked,
        idUsuario: idUsuarioInput.value,
        senha: senhaInput.value
    };
}

// Função para salvar os dados no LocalStorage (parcial ou completo)
function salvarDadosNoLocalStorage(completo = false) {
    const formData = coletarDadosFormulario();
    localStorage.setItem('dadosFormulario', JSON.stringify(formData));
    if (completo) {
        let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        const usuarioIndex = usuarios.findIndex(usuario => usuario.idUsuario === formData.idUsuario);
        if (usuarioIndex !== -1) {
            // Atualizar o usuário existente
            usuarios[usuarioIndex] = {
                cpf: formData.cpf,
                idUsuario: formData.cpf, // ID séra o cpf
                senha: formData.senha
            };
        } else {
            // Criar um novo usuário
            usuarios.push({
                cpf: formData.cpf,
                idUsuario: formData.cpf, // ID séra o cpf
                senha: formData.senha
            });
        }
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        localStorage.setItem('inscricaoConcluida', 'true');
    }
    console.log('Dados do formulário salvos no LocalStorage:', formData);
    return true;
}

// Função para carregar os dados do LocalStorage e preencher o formulário
function carregarDadosDoLocalStorage() {
    const dadosSalvos = localStorage.getItem('dadosFormulario');
    if (dadosSalvos) {
        try {
            const formData = JSON.parse(dadosSalvos);
            if (formData.nome !== undefined) nomeInput.value = formData.nome;
            if (formData.nascimento !== undefined) nascimentoInput.value = formData.nascimento;
            if (formData.cpf !== undefined) {
                cpfInput.value = formData.cpf;
                idUsuarioInput.value = formData.cpf; // Carrega o CPF no ID
            }
            if (formData.sexo !== undefined) sexoInput.value = formData.sexo;
            if (formData.email !== undefined) emailInput.value = formData.email;
            if (formData.telefone !== undefined) telefoneInput.value = formData.telefone;
            if (formData.cep !== undefined) cepInput.value = formData.cep;
            if (formData.rua !== undefined) ruaInput.value = formData.rua;
            if (formData.numero !== undefined) numeroInput.value = formData.numero;
            if (formData.cidade !== undefined) cidadeInput.value = formData.cidade;
            if (formData.estado !== undefined) estadoInput.value = formData.estado;
            if (formData.trilhaSelecionada !== undefined) {
                radioTrilhas.forEach(radio => {
                    if (radio.value === formData.trilhaSelecionada) radio.checked = true;
                });
            }
            if (formData.declaracaoAceita !== undefined) checkboxDeclaracaoInput.checked = formData.declaracaoAceita;
            if (formData.idUsuario !== undefined) idUsuarioInput.value = formData.idUsuario;
            if (formData.senha !== undefined) senhaInput.value = formData.senha;
            // Atualizar o texto dos campos de upload
            if (formData.identidadeNome !== undefined) {
                const uploadContainer = identidadeFile.closest('.upload-identidade');
                const span = uploadContainer.querySelector('.upload-text');
                span.textContent = formData.identidadeNome || 'Clique aqui para selecionar o arquivo';
                if (formData.identidadeNome) {
                    span.classList.add('has-file');
                }
            }
            if (formData.residencialNome !== undefined) {
                const uploadContainer = residencialFile.closest('.upload-residencia');
                const span = uploadContainer.querySelector('.upload-text');
                span.textContent = formData.residencialNome || 'Clique aqui para selecionar o arquivo';
                if (formData.residencialNome) {
                    span.classList.add('has-file');
                }
            }
            console.log('Dados do LocalStorage carregados no formulário:', formData);
        } catch (error) {
            console.error('Erro ao carregar dados do LocalStorage:', error);
        }
    }
}

// Função para limpar o formulário
function limparFormulario() {
    formulario.reset();
    console.log('Formulário limpo.');
    document.querySelectorAll('.erro-mensagem').forEach(span => {
        span.textContent = '';
        span.classList.remove('ativo');
    });
    document.querySelectorAll('.input-invalido').forEach(input => input.classList.remove('input-invalido'));
    document.querySelectorAll('.upload-text').forEach(span => {
        span.textContent = 'Clique aqui para selecionar o arquivo';
        span.classList.remove('has-file');
    });
}

// Função para remover dados do LocalStorage
function removerDadosDoLocalStorage() {
    localStorage.removeItem('dadosFormulario');
    localStorage.removeItem('inscricaoConcluida');
    console.log('Dados do formulário removidos do LocalStorage.');
}

// Função para exibir mensagens de erro
function exibirMensagemErro(campo, mensagem) {
    const erroElement = document.getElementById(`erro-${campo.id || campo.dataset.id}`);
    if (erroElement) {
        erroElement.textContent = mensagem;
        erroElement.classList.add('ativo');
        if (campo.tagName === 'INPUT' || campo.tagName === 'SELECT') campo.classList.add('input-invalido');
    }
}

// Função para limpar mensagens de erro
function limparMensagemErro(campo) {
    const erroElement = document.getElementById(`erro-${campo.id || campo.dataset.id}`);
    if (erroElement) {
        erroElement.textContent = '';
        erroElement.classList.remove('ativo');
        if (campo.tagName === 'INPUT' || campo.tagName === 'SELECT') campo.classList.remove('input-invalido');
    }
}

// Função de validação do formulário (usada apenas para "Fazer Inscrição")
function validarFormulario() {
    let formularioValido = true;

    const camposObrigatorios = formulario.querySelectorAll('[required]:not(#idUsuario)');
    camposObrigatorios.forEach(campo => {
        limparMensagemErro(campo);
        if (!campo.value.trim() && campo.type !== 'file' && campo.type !== 'radio' && campo.type !== 'checkbox') {
            exibirMensagemErro(campo, `O campo "${campo.labels[0]?.textContent || campo.id}" é obrigatório.`);
            formularioValido = false;
        }
    });

    if (nomeInput.value.trim()) {
        if (!/^[A-Za-zÀ-ú\s]+$/.test(nomeInput.value.trim())) {
            exibirMensagemErro(nomeInput, 'Digite um nome válido (apenas letras e espaços).');
            formularioValido = false;
        } else if (nomeInput.value.trim().length < 3) {
            exibirMensagemErro(nomeInput, 'O nome deve ter pelo menos 3 caracteres.');
            formularioValido = false;
        }
    }

    if (nascimentoInput.value.trim()) {
        const dataNascimento = new Date(nascimentoInput.value);
        const hoje = new Date();
        let idade = hoje.getFullYear() - dataNascimento.getFullYear();
        const m = hoje.getMonth() - dataNascimento.getMonth();
        if (m < 0 || (m === 0 && hoje.getDate() < dataNascimento.getDate())) idade--;
        if (idade < 18) {
            exibirMensagemErro(nascimentoInput, 'Você deve ter pelo menos 18 anos.');
            formularioValido = false;
        }
    }

    // Validação específica do CPF
    if (cpfInput.value.trim()) {
        if (!validarCPF(cpfInput.value.replace(/\D/g, ''))) {
            exibirMensagemErro(cpfInput, 'Digite um CPF válido.');
            formularioValido = false;
        }
    }    

    if (emailInput.value.trim() && !isValidEmail(emailInput.value.trim())) {
        exibirMensagemErro(emailInput, 'Digite um e-mail válido.');
        formularioValido = false;
    }

    if (telefoneInput.value.trim()) {
        const telefoneLimpo = telefoneInput.value.replace(/\D/g, '');
        if (!/^\d{10,11}$/.test(telefoneLimpo)) {
            exibirMensagemErro(telefoneInput, 'Digite um telefone válido (10 ou 11 dígitos).');
            formularioValido = false;
        }
    }

    if (cepInput.value.trim() && !/^\d{8}$/.test(cepInput.value.replace(/\D/g, ''))) {
        exibirMensagemErro(cepInput, 'Digite um CEP válido (8 dígitos).');
        formularioValido = false;
    }

    if (estadoInput.value.trim().length !== 2 || !/^[A-Z]{2}$/.test(estadoInput.value.trim())) {
        exibirMensagemErro(estadoInput, 'Digite a sigla do estado com 2 letras (ex: SP).');
        formularioValido = false;
    }

    if (!identidadeFile.files[0] && !localStorage.getItem('dadosFormulario')?.includes('"identidadeNome":"')) {
        exibirMensagemErro(identidadeFile, 'O arquivo de identidade é obrigatório.');
        formularioValido = false;
    } else {
        limparMensagemErro(identidadeFile);
    }

    if (!residencialFile.files[0] && !localStorage.getItem('dadosFormulario')?.includes('"residencialNome":"')) {
        exibirMensagemErro(residencialFile, 'O comprovante de residência é obrigatório.');
        formularioValido = false;
    } else {
        limparMensagemErro(residencialFile);
    }

    const trilhaSelecionada = document.querySelector('input[name="trilha"]:checked');
    if (!trilhaSelecionada) {
        trilhasContainer.dataset.id = 'trilha';
        exibirMensagemErro(trilhasContainer, 'Selecione pelo menos uma trilha de aprendizagem.');
        formularioValido = false;
    } else {
        limparMensagemErro(trilhasContainer);
    }

    if (!checkboxDeclaracaoInput.checked) {
        exibirMensagemErro(checkboxDeclaracaoInput, 'Você deve aceitar os termos.');
        formularioValido = false;
    } else {
        limparMensagemErro(checkboxDeclaracaoInput);
    }

    // Validação específica do idUsuario
    if (!idUsuarioInput.value.trim()) {
        exibirMensagemErro(idUsuarioInput, 'O campo "ID do Usuário" é obrigatório.');
        formularioValido = false;
    } else if (idUsuarioInput.value.trim() !== cpfInput.value.trim()) {
        exibirMensagemErro(idUsuarioInput, 'O ID do Usuário deve ser igual ao CPF.');
        formularioValido = false;
    }

    if (senhaInput.value.trim()) {
        if (senhaInput.value.length < 6) {
            exibirMensagemErro(senhaInput, 'A senha deve ter pelo menos 6 caracteres.');
            formularioValido = false;
        }
    }

    return formularioValido;
}

// Função auxiliar para validar CPF
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

// Função auxiliar para validar e-mail
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Eventos
if (botaoSalvar) {
    botaoSalvar.addEventListener('click', function() {
        salvarDadosNoLocalStorage(false); // Salva sem validar
        mensagemTexto.textContent = 'Dados salvos com sucesso!';
        mensagemSucesso.style.display = 'block';
        botaoSalvar.disabled = true;
        botaoInscricao.disabled = true;
        botaoCancelar.disabled = true;
    });
}

if (botaoCancelar) {
    botaoCancelar.addEventListener('click', function() {
        limparFormulario();
        removerDadosDoLocalStorage();
        window.location.href = 'capa.html';
    });
}

if (botaoInscricao) {
    botaoInscricao.addEventListener('click', function(event) {
        event.preventDefault();
        botaoInscricao.disabled = true;

        idUsuarioInput.value = cpfInput.value; // Força a cópia do CPF para idUsuario
        console.log('Validando formulário...'); // Log para depuração
        if (validarFormulario()) {
            console.log('Formulário válido, salvando dados...'); // Log para depuração
            const sucesso = salvarDadosNoLocalStorage(true);
            console.log('Sucesso ao salvar:', sucesso); // Log para depuração
            if (sucesso) {
                mensagemTexto.textContent = 'Inscrição realizada com sucesso!';
                mensagemSucesso.style.display = 'block'; // Exibe a mensagem
                console.log('Mensagem de sucesso exibida'); // Log para depuração
                botaoSalvar.disabled = true;
                botaoInscricao.disabled = true;
                botaoCancelar.disabled = true;
                setTimeout(() => {
                    window.location.href = 'capa.html';
                }, 2000);
            } else {
                console.log('Falha ao salvar os dados'); // Log para depuração
                botaoInscricao.disabled = false;
            }
        } else {
            console.log('Formulário inválido'); // Log para depuração
            botaoInscricao.disabled = false;
        }
    });
}

if (okBtn) {
    okBtn.addEventListener('click', function() {
        window.location.href = 'capa.html';
    });
}

