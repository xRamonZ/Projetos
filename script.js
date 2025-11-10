// script.js

// Espera o DOM carregar completamente
document.addEventListener("DOMContentLoaded", () => {

    // --- Seletores Globais ---
    const hero = document.getElementById('hero');
    const mainContent = document.getElementById('main-content');
    const enterButton = document.getElementById('enter-button');
    const daysCounter = document.getElementById('days-counter');
    const heartsContainer = document.getElementById('floating-hearts-container');
    const musicToggle = document.getElementById('music-toggle');
    const bgMusic = document.getElementById('background-music');
    // const successSound = document.getElementById('success-sound'); // Removido pois não está no HTML
    
    // --- 1. Lógica do Hero ---

    // Calculadora de dias
    function calculateDays() {
        // Data alvo (1 ano de namoro)
        const startDate = new Date('2024-11-16T00:00:00');
        const today = new Date();
        const diffTime = Math.abs(today - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        daysCounter.textContent = `${diffDays} dias de amor`;
    }
    calculateDays();
    setInterval(calculateDays, 60000); // Atualiza a cada minuto

    // Botão "Entrar"
    enterButton.addEventListener('click', () => {
        // Rola suavemente para a primeira seção
        document.getElementById('timeline').scrollIntoView({
            behavior: 'smooth'
        });
        // Inicia o efeito de máquina de escrever
        typeWriterEffect();
    });

    // Controle de Música
    let isMusicPlaying = false;
    musicToggle.addEventListener('click', () => {
        if (isMusicPlaying) {
            bgMusic.pause();
            musicToggle.textContent = '🔇';
        } else {
            bgMusic.play().catch(e => console.error("Erro ao tocar música:", e)); // Autoplay pode falhar
            musicToggle.textContent = '🔊';
        }
        isMusicPlaying = !isMusicPlaying;
    });

    // Corações Flutuantes (requestAnimationFrame)
    function createHeart() {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        heart.textContent = '❤️';
        heart.style.left = `${Math.random() * 100}vw`;
        heart.style.animationDuration = `${Math.random() * 5 + 5}s`; // Duração de 5 a 10s
        heart.style.fontSize = `${Math.random() * 1 + 0.5}rem`; // Tamanho de 0.5 a 1.5rem
        heartsContainer.appendChild(heart);

        // Remove o coração depois que a animação termina
        setTimeout(() => {
            heart.remove();
        }, 10000);
    }
    setInterval(createHeart, 500); // Cria um novo coração a cada 500ms

    // --- Lógica de Scroll (IntersectionObserver) ---
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Opcional: para de observar depois de revelar
                // revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1 // Revela quando 10% do item está visível
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- 3. Galeria de Fotos ---
    const photoUpload = document.getElementById('photo-upload');
    const galleryGrid = document.getElementById('gallery-grid');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');

    // Carrega fotos do localStorage (se houver)
    loadGalleryFromStorage();

    photoUpload.addEventListener('change', (e) => {
        // Remove placeholders se for o primeiro upload
        const placeholders = galleryGrid.querySelectorAll('.placeholder');
        if (placeholders.length > 0) {
            placeholders.forEach(p => p.remove());
        }

        for (const file of e.target.files) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const imgDataUrl = event.target.result;
                createGalleryItem(imgDataUrl);
                saveImageToStorage(imgDataUrl);
            }
            reader.readAsDataURL(file);
        }
    });

    function createGalleryItem(src) {
        const item = document.createElement('div');
        item.classList.add('gallery-item', 'reveal'); // Adiciona reveal para animar
        const img = document.createElement('img');
        img.src = src;
        img.loading = 'lazy'; // Lazy loading
        item.appendChild(img);
        
        // Adiciona evento de clique para o lightbox
        img.addEventListener('click', () => {
            lightbox.style.display = 'block';
            lightboxImg.src = src;
        });
        
        galleryGrid.appendChild(item);
        revealObserver.observe(item); // Observa o novo item
    }

    // Fechar Lightbox
    lightboxClose.addEventListener('click', () => {
        lightbox.style.display = 'none';
    });
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.style.display = 'none';
        }
    });

    // LocalStorage da Galeria
    function saveImageToStorage(imgDataUrl) {
        const images = JSON.parse(localStorage.getItem('galleryImages')) || [];
        images.push(imgDataUrl);
        localStorage.setItem('galleryImages', JSON.stringify(images));
    }

    function loadGalleryFromStorage() {
        const images = JSON.parse(localStorage.getItem('galleryImages')) || [];
        if (images.length > 0) {
            galleryGrid.innerHTML = ''; // Limpa placeholders
            images.forEach(src => createGalleryItem(src));
        }
    }


    // --- 4. Quiz Romântico ---
    const quizForm = document.getElementById('quiz-form');
    const quizSuccessModal = document.getElementById('quiz-success-modal');
    const closeModalButton = document.getElementById('close-modal');

    const correctAnswers = {
        q1: 'Praça da Juventude',
        q2: 'Shopping',
        q3: 'Vaso de flores',
        q4: 'Natal',
        q5: ['sim', 'muito', 'lógico', 'com certeza'] // Respostas múltiplas corretas
    };

    quizForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(quizForm);
        let score = 0;
        
        const answerQ1 = formData.get('q1');
        const answerQ2 = formData.get('q2');
        const answerQ3 = formData.get('q3');
        const answerQ4 = formData.get('q4');
        const answerQ5 = formData.get('q5');

        if (answerQ1 === correctAnswers.q1) score++;
        if (answerQ2 === correctAnswers.q2) score++;
        if (answerQ3 === correctAnswers.q3) score++;
        if (answerQ4 === correctAnswers.q4) score++;
        if (correctAnswers.q5.includes(answerQ5)) score++;

        if (score === 5) {
            // Acertou tudo!
            showFinalSurprise();
        } else {
            alert(`Você acertou ${score} de 5. Tente de novo, amor!`);
        }
    });

    // --- 8. Surpresa Final (Ativada pelo Quiz) ---
    function showFinalSurprise() {
        quizSuccessModal.classList.add('active');
        document.body.classList.add('quiz-success'); // Ativa transição de cor
        // if (successSound) successSound.play(); // Opcional
        startConfetti();
    }

    closeModalButton.addEventListener('click', () => {
        quizSuccessModal.classList.remove('active');
        // document.body.classList.remove('quiz-success'); // Opcional: remover a cor de fundo
    });

    // Gerador de Confete
    function startConfetti() {
        const container = document.getElementById('confetti-container');
        container.innerHTML = ''; // Limpa confetes antigos
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            confetti.style.left = `${Math.random() * 100}vw`;
            confetti.style.animationDelay = `${Math.random() * 3}s`;
            confetti.style.transform = `scale(${Math.random() * 0.5 + 0.5})`;
            container.appendChild(confetti);
        }
    }


    // --- 5. Carta (Máquina de Escrever) ---
    const letterText = `Minha Laura,

Feliz um ano de namoro para nós!

Parece que foi ontem que demos nosso primeiro beijo naquela praça. Desde aquele dia, minha vida mudou completamente. 
Você trouxe cor, alegria e um amor que eu nem sabia que era possível sentir.

Cada momento ao seu lado é especial. Eu amo cada segundo que passo com você, agora que você não está tão longe podemos aproveitar ainda mais nosso tempo juntos.

Esse site foi a forma que encontrei de tentar demonstrar um pouquinho do quanto você é importante para mim. Cada linha de código, cada animação, foi pensando em você e no seu sorriso.

Obrigado por ser essa mulher incrível, inteligente, linda e minha parceira de vida. 
Que esse seja o primeiro de infinitos anos ao seu lado.

Eu te amo mais do que as palavras podem expressar.

Com todo o meu amor,
Ramon.`;

    const typewriterElement = document.getElementById('typewriter-content');
    
    function typeWriterEffect() {
        let i = 0;
        typewriterElement.innerHTML = ""; // Limpa o conteúdo
        typewriterElement.classList.add('typing'); // Adiciona cursor
        
        function type() {
            if (i < letterText.length) {
                // Adiciona a quebra de linha quando necessário, mantendo o pre-wrap
                typewriterElement.innerHTML += letterText.charAt(i) === '\n' ? '<br>' : letterText.charAt(i);
                i++;
                setTimeout(type, 50); // Velocidade de digitação
            } else {
                typewriterElement.classList.remove('typing'); // Remove cursor ao finalizar
            }
        }
        type();
    }


    // --- 7. Livro de Recados ---
    const guestbookEntry = document.getElementById('guestbook-entry');
    const saveMessageButton = document.getElementById('save-message');
    const messagesList = document.getElementById('messages-list');
    const exportTxtButton = document.getElementById('export-txt');
    const clearMessagesButton = document.getElementById('clear-messages');

    loadMessages();

    saveMessageButton.addEventListener('click', saveMessage);
    exportTxtButton.addEventListener('click', exportMessages);
    clearMessagesButton.addEventListener('click', clearMessages);

    function loadMessages() {
        const messages = JSON.parse(localStorage.getItem('guestbookMessages')) || [];
        messagesList.innerHTML = '';
        if (messages.length === 0) {
            messagesList.innerHTML = '<p style="text-align:center; color:#999;">Ainda não há recados. Seja a primeira a deixar um!</p>';
        } else {
            messages.forEach(msg => {
                const item = document.createElement('div');
                item.classList.add('guestbook-message');
                item.innerHTML = `<p>${msg.text.replace(/\n/g, '<br>')}</p><span class="timestamp">${msg.timestamp}</span>`;
                messagesList.prepend(item); // Mostra mais recentes primeiro
            });
        }
    }

    function saveMessage() {
        const text = guestbookEntry.value.trim();
        if (text) {
            const now = new Date();
            const timestamp = now.toLocaleDateString('pt-BR') + ' ' + now.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'});
            
            const messages = JSON.parse(localStorage.getItem('guestbookMessages')) || [];
            messages.push({ text, timestamp });
            localStorage.setItem('guestbookMessages', JSON.stringify(messages));
            
            guestbookEntry.value = '';
            loadMessages();
        } else {
            alert('Por favor, escreva um recado!');
        }
    }

    function exportMessages() {
        const messages = JSON.parse(localStorage.getItem('guestbookMessages')) || [];
        if (messages.length === 0) {
            alert('Não há mensagens para exportar.');
            return;
        }

        let exportText = "--- Livro de Recados de Ramon e Laura ---\n\n";
        messages.forEach((msg, index) => {
            exportText += `Recado #${index + 1} (${msg.timestamp})\n`;
            exportText += msg.text + "\n";
            exportText += "--------------------------------------\n";
        });

        const blob = new Blob([exportText], { type: 'text/plain;charset=utf-8' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'Recados_Ramon_Laura.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    function clearMessages() {
        if (confirm('Tem certeza que deseja apagar TODOS os recados? Essa ação é irreversível!')) {
            localStorage.removeItem('guestbookMessages');
            loadMessages();
        }
    }
    
    
    // --- 6. Mini-game ---
    const gameOverlay = document.getElementById('secret-game');
    const gameContainer = document.getElementById('game-container');
    const gameScoreDisplay = document.getElementById('game-score');
    const gameMessage = document.getElementById('game-message');
    const closeGameButton = document.getElementById('close-game');
    
    let score = 0;
    let isGameRunning = false;
    let heartInterval;
    let inputSequence = '';
    const startCode = 'momoh';
    const WIN_SCORE = 25; // Pontuação para vencer

    // Ativa o jogo digitando o código "momoh" em qualquer lugar da tela
    document.addEventListener('keydown', (e) => {
        if (isGameRunning) return;

        inputSequence += e.key.toLowerCase();
        // Mantém a sequência com o tamanho máximo do código
        if (inputSequence.length > startCode.length) {
            inputSequence = inputSequence.slice(-startCode.length);
        }

        if (inputSequence === startCode) {
            startGame();
        }
    });

    closeGameButton.addEventListener('click', endGame);

    function startGame() {
        gameOverlay.style.display = 'flex';
        score = 0;
        updateGameMessage(); // Atualiza a mensagem inicial
        updateScore();
        isGameRunning = true;
        inputSequence = ''; // Reseta a sequência
        heartInterval = setInterval(createFallingHeart, 1000); // Cria um coração a cada segundo
    }

    function endGame() {
        isGameRunning = false;
        clearInterval(heartInterval);
        // Remove todos os corações
        gameContainer.querySelectorAll('.game-heart').forEach(h => h.remove()); 
        gameOverlay.style.display = 'none';
        gameMessage.textContent = 'Digite "momoh" para começar'; // Reseta a mensagem
    }

    function updateScore() {
        gameScoreDisplay.textContent = `Pontos: ${score}`;
        updateGameMessage(); // Sempre atualiza a mensagem ao mudar a pontuação
    }

    function updateGameMessage() {
        if (score >= WIN_SCORE) {
            gameMessage.innerHTML = 'Parabéns meu amorrrrrr!!!!';
            clearInterval(heartInterval); // Para a criação de novos corações
            isGameRunning = false; // Impede cliques e novos corações
            // Opcional: manter a mensagem de vitória por mais tempo ou fazer algo mais
            // setTimeout(() => { gameMessage.textContent = 'Você conseguiu! 🎉'; }, 5000); 
        } else if (score >= 15) {
            gameMessage.textContent = 'Muito perto!';
        } else if (score >= 5) {
            gameMessage.textContent = 'Quase lá!';
        } else {
            gameMessage.textContent = 'Nem perto...';
        }
    }

    function createFallingHeart() {
        if (!isGameRunning || score >= WIN_SCORE) return; // Não cria corações se o jogo não está rodando ou já venceu
        
        const heart = document.createElement('div');
        heart.classList.add('game-heart');
        heart.textContent = '💖';
        
        // Posição aleatória na horizontal
        const startX = Math.random() * (gameContainer.clientWidth - 50); // 50px de margem
        heart.style.left = `${startX}px`;
        
        // Duração da queda aleatória (para que não caiam juntos)
        const duration = Math.random() * 2 + 3; // 3 a 5 segundos
        heart.style.animationDuration = `${duration}s`;

        // Evento de clique
        heart.addEventListener('click', () => {
            if (isGameRunning && score < WIN_SCORE) { // Só permite clicar se o jogo está rodando e não venceu
                score += 1; // Cada coração vale 1 ponto para o desafio de 25
                updateScore();
                heart.remove();
            }
        });

        // Remove o coração se cair fora da tela
        heart.addEventListener('animationend', () => {
            heart.remove();
        });

        gameContainer.appendChild(heart);
    }
    
});