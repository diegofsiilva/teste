class FishGame extends Phaser.Scene {
    constructor() {
        super({ key: 'FishGame' }); // Define a chave da cena
        this.gameOver = false; // Variável para indicar se o jogo acabou
        this.fishes = []; // Lista que armazena os peixes ativos na tela
        this.conclusaoAtiva = false; // Variável para indicar se a conclusão da fase está ativa
    }
    

    preload() {
        // Carregando o spritesheet do peixe abaixo da agua
        this.load.spritesheet('darkFish', 'assets/water/darkFish.png', { frameWidth: 320, frameHeight: 320 });

        // Carregando os spritesheets dos peixes na pasta assets
        this.load.spritesheet('orangeFish', 'assets/water/orangeFish.png', { frameWidth: 320, frameHeight: 320 });
        this.load.spritesheet('blueFish', 'assets/water/blueFish.png', { frameWidth: 320, frameHeight: 320 });
        this.load.spritesheet('greenFish', 'assets/water/greenFish.png', { frameWidth: 320, frameHeight: 320 });

        // Carregando a imagem do progress bar
        this.load.spritesheet('progressBar', 'assets/water/extras/progressBar.png', { frameWidth: 436, frameHeight: 90 })

        // Carregando a imagem dos buttons
        this.load.image('nextButton', 'assets/water/extras/nextButton.png');
        this.load.image('homeButton', 'assets/water/extras/homeButton.png');
        this.load.image('restartButton', 'assets/water/extras/restartButton.png');

        // Carregando a imagem do círculo
        this.load.image('circle', 'assets/water/extras/circulo.png');

        // Carregando os sons do jogo
        this.load.audio('fishSwim', 'assets/water/sounds/fishSwim.mp3');
        this.load.audio('fishClick', 'assets/water/sounds/fishClick.mp3');
        this.load.audio('buttonClick', 'assets/water/sounds/buttonClick.mp3');
    }


    create() {
        //===========================
        // Inicializando o jogo
        //===========================
        this.cameras.main.setBackgroundColor('#ADD8E6');

        // Criando animações para cada peixe
        this.createFishAnimation('darkFish');
        this.createFishAnimation('orangeFish');
        this.createFishAnimation('blueFish');
        this.createFishAnimation('greenFish');

        // Iniciando o primeiro peixe após um pequeno atraso
        this.time.delayedCall(1000, this.spawnFish, [], this);

        // Adicionando um evento de toque na tela
        this.input.on('pointerdown', this.stopFish, this);

        // Recomendando
        this.gameOver = false;
        this.progressBarFrame = 0;
        this.fishes = [];
        this.conclusaoAtiva = false;

        
        //===========================
        // Sons
        //===========================
        this.fishSwimSound = this.sound.add('fishSwim', { loop: true }); // toca continuamente
        this.fishClickSound = this.sound.add('fishClick'); // toca quando o peixe é clicado
        this.buttonClickSound = this.sound.add('buttonClick'); // toca quando o botão é clicado


        //===========================
        // Progress Bar
        //===========================
        this.progressBar = this.add.sprite(this.game.config.width - 10, 10, 'progressBar')
            .setScale(0.75)
            .setOrigin(1, 0)
            .setFrame(0)
            .setDepth(110); 


        //===========================
        // Next button
        //===========================
        this.nextButton = this.add.image(50, this.game.config.height - 50, 'nextButton')
            .setScale(0.75)
            .setInteractive()
            .setVisible(false)
            .setDepth(110);
            
        // Removendo o peixe atual e o círculo quando o next button é pressionado
        this.nextButton.on('pointerdown', () => { 
            this.buttonClickSound.play();
            
            if (this.currentFish) {    
                this.currentFish.destroy();   
            }

            if (this.circle) {           
                this.circle.destroy();   
                this.circle = null; 
            }
            if (this.arrow) {     
                this.arrow.destroy();      
                this.arrow = null;  
            }
            if (this.instructionText) { 
                this.instructionText.destroy(); 
                this.instructionText = null;
            }
            this.nextButton.setVisible(false); 
            if (!this.gameOver) { 
                this.spawnFish();
            }

            // Se a barra de progresso estiver cheia, parar o jogo
            if (this.progressBarFrame === 5) {
                if (!this.conclusaoAtiva) {
                    this.scene.launch('ConclusaoFase');
                    this.conclusaoAtiva = true;
                    this.restartButton.setVisible(true);
                } else {
                    this.scene.stop('ConclusaoFase');
                    this.sound.stopAll();
                    this.scene.start('menuPrincipal');
                }
            }
        });


        //===========================
        // Home button
        //===========================
        this.homeButton = this.add.image(50, 50, 'homeButton')
            .setScale(0.75)
            .setInteractive()
            .setDepth(110);

        // Adicionando um botão seguro no botão "Home"
        this.homeButton.on('pointerdown', () => {
            this.buttonClickSound.play();

            // Criando um retângulo de progresso abaixo do botão "Home" para indicar um hold seguro
            this.homeProgress = this.add.rectangle(
                this.homeButton.x - 50,
                this.homeButton.y * 2 / 3.25,
                10, 20, 0x00FF00
            )
            .setOrigin(0.5, 0)
            .setDepth(115);

            // Animando o retângulo para indicar um hold seguro
            this.tweens.add({
                targets: this.homeProgress,
                scaleY: 3,
                duration: 1200,
                ease: 'Power2'
            });
        });

        this.homeButton.on('pointerup', () => {
            // Pegando o tempo de pressão (em segundos)
            const holdTime = this.input.activePointer.getDuration() / 1000;

            if (this.homeProgress) {
                this.homeProgress.destroy();
                this.homeProgress = null;
            }

            // Se o botão "Home" for pressionado por mais de 1 segundo, mudar de cena
            if (holdTime > 1) {
                this.scene.stop('FishGame');
                this.sound.stopAll();
                this.scene.start('menuPrincipal');
            }
        });


        //===========================
        // Restart button
        //===========================
        this.restartButton = this.add.image(this.game.config.width - 50, this.game.config.height - 50, 'restartButton')
            .setScale(0.75) 
            .setInteractive()
            .setVisible(false)
            .setDepth(110);

        this.restartButton.on('pointerdown', () => {
            this.buttonClickSound.play();
            this.scene.restart();
        });
    }


    //================================
    // Criando a animação do peixe
    //================================
    createFishAnimation(key) {
        // Criando animação para o peixe específico
        this.anims.create({
            key: key + '_swim',
            frames: this.anims.generateFrameNumbers(key, { start: 0, end: 7 }),
            frameRate: 10, // Velocidade da animação
            repeat: -1 // Repetir infinitamente
        });
    }


    //===========================
    // Gerando os peixes
    //===========================
    spawnFish() {
        if (this.gameOver) return; // Se o jogo acabou, não gerar mais peixes

        // Escolher a cor verdadeira do peixe
        const fishType = Phaser.Utils.Array.GetRandom(['orangeFish', 'blueFish', 'greenFish']); 

        // Criando o peixe na borda direita da tela em uma posição aleatória na vertical
        const fish = this.add.sprite(this.game.config.width, Phaser.Math.Between(100, this.game.config.height - 100), 'darkFish');


        //================================
        // Configuração inicial do peixe
        //================================
        fish.originalType = fishType; // Armazena o tipo real do peixe para quando ele ressurgir
        fish.resurfaced = false; // Variável para saber se o peixe está abaixo da água
        fish.resurfacing = false; // Variável para saber se o peixe está ressurgindo
        fish.tapCount = 0; // Contar quantas vezes o peixe foi tocado
        fish.lastTapTime = 0; // Contar o tempo do último toque
        fish.isInvincible = false; // Garante que o peixe começa não-invencível
        fish.alreadyTapped = false; //Inicializa a flag para evitar múltiplos toques que incrementem a barra
        fish.setScale(1); // Tamanho do peixe
        fish.play('darkFish_swim'); // Animação do peixe sombra
        this.fishSwimSound.play(); // Toca o som de natação do peixe


        //=====================================
        // Configuração do ângulo e velocidade
        //=====================================
        fish.angle = Phaser.Math.Between(-60, 60);

        // Adicionando um cooldown para evitar múltiplas inversões rápidas
        fish.lastDirectionChange = 0;
        fish.stopped = false; // Garantindo que o peixe começa em movimento

        // Atualizando velocidade baseada no ângulo
        this.updateFishSpeed(fish);


        //===========================
        // Adiciona peixe à lista
        //===========================
        this.fishes.push(fish);
        this.currentFish = fish; //Define o peixe atual para referência ao usar o next button
    }    


    //===========================
    // Velocidade do peixe
    //===========================
    updateFishSpeed(fish) {
        // Converte o ângulo para radianos
        const radians = Phaser.Math.DegToRad(fish.angle);
        
        // Calcula a nova velocidade baseada no ângulo
        fish.speedX = Math.cos(radians) * -5;
        fish.speedY = -Math.sin(radians) * 3;
    }


    //===========================
    // Virada suave do peixe
    //===========================
    smoothTurn(fish, newAngle) {
        // Faz uma curva suave para o novo ângulo ao longo do tempo
        this.tweens.add({
            targets: fish,
            angle: newAngle,
            duration: 500, // Tempo de rotação gradual
            onUpdate: () => {
                this.updateFishSpeed(fish); // Atualiza a velocidade gradualmente
            }
        });
    }    


    //===========================
    // Atualização do jogo
    //===========================
    update(time) { // Movendo os peixes corretamente
        if (!Array.isArray(this.fishes) || this.fishes.length === 0) {
            return; // Sai do update se não houver peixes ativos
        }

        this.fishes.forEach(fish => {
            if (!fish.stopped) {
                fish.x += fish.speedX; // Movimento horizontal
                fish.y += fish.speedY; // Movimento vertical

                // Limitar o peixe dentro da tela
                fish.y = Phaser.Math.Clamp(fish.y, 50, this.game.config.height - 50);  // Mantém dentro dos limites verticais

                // Se o peixe atingir o topo ou o fundo, ele muda suavemente de direção
                if ((fish.y <= 50 || fish.y >= this.game.config.height - 50) && time > fish.lastDirectionChange + 1000) {
                    const newAngle = fish.angle > 0 ? Phaser.Math.Between(-60, 0) : Phaser.Math.Between(0, 60);
                    this.smoothTurn(fish, newAngle);
                    fish.lastDirectionChange = time;
                }

                // Se chegou o momento da próxima curva, definir um novo ângulo
                if (this.time.now >= fish.nextTurnTime) {
                    const randomAngle = Phaser.Math.Between(-60, 60); // Novo ângulo aleatório
                    this.smoothTurn(fish, randomAngle); // Aplicar curva suave
                    fish.nextTurnTime = this.time.now + Phaser.Math.Between(1000, 3000); // Definir próximo tempo de mudança
                }

                // Se o peixe saiu da tela pela esquerda
                if (fish.x < -100) { 
                    fish.destroy(); // Remove o peixe da cena
                    this.fishes = this.fishes.filter(f => f !== fish); // Remove da lista de peixes ativos
                    this.spawnFish(); // Gera um novo peixe
                }                
            }
        });      
    } 


    //===========================
    // Resurfacing fish
    //===========================
    resurfaceFish(fish) {
        fish.resurfaced = true; // Marcar que o peixe ressurgiu
        fish.tapCount = 0; // Resetar contagem de toques
    
        // Armazena o índice do frame atual antes da mudança
        const currentFrameIndex = fish.anims.currentFrame.index;
    
        // Esperar 1 segundo antes de mudar a textura e a animação
        this.time.delayedCall(500, () => { 
            fish.setTexture(fish.originalType); // Mudar para a cor real do peixe
            fish.play(fish.originalType + '_swim'); // Ativar animação do peixe
    
            // Aplicar o mesmo frame da animação anterior para continuidade
            fish.anims.setCurrentFrame(fish.anims.currentAnim.frames[currentFrameIndex]); 
    
            fish.stopped = false; // Permitir que o peixe continue se movendo
            this.updateFishSpeed(fish); // Garantir que a velocidade do peixe seja recalculada

            fish.resurfaced = true;
            fish.resurfacing = false;
        });
    }       


    //===============================================
    // Determina a posição do círculo e do texto
    //===============================================
    determineInstructionPlacement(circleX, circleY, pointerY) {
        const verticalGap = 200;   //espaçamento entre a seta e o círculo
        const textGap = 50;       // espaçamento entre a seta e o texto
        let placement = {};

        //Se o círculo estiver muito próximo da borda esquerda ou direita, centraliza o texto e remove a seta
        if (circleX < 150 || circleX > this.game.config.width - 150) {                       
            placement.textX = this.game.config.width / 2;  
            placement.textY = this.game.config.height / 2;                     
            placement.arrowText = "";                         
        } else {
                if (pointerY < this.game.config.height / 2) {
                    placement.arrowX = circleX; 
                    placement.arrowY = circleY + verticalGap;  
                    placement.arrowText = "↑";     
                    placement.textX = circleX;           
                    placement.textY = circleY + verticalGap + textGap; 
                } else {
                    placement.arrowX = circleX;
                    placement.arrowY = circleY - verticalGap;
                    placement.arrowText = "↓";
                    placement.textX = circleX;
                    placement.textY = circleY - verticalGap - textGap;
                } 
        }
        return placement;
    }


    //===========================
    // Parar o peixe
    //===========================
    stopFish(pointer) {
        let fishStopped = false;
        
        this.fishes.forEach(fish => {
            // Se o peixe estiver invencível, segue normal
            if (fish.isInvincible || fish.resurfacing) {
                return;
            }
            

            //===========================
            // To surface fish
            //===========================
            if (fish.getBounds().contains(pointer.x, pointer.y)) {
                const currentTime = this.time.now;
                
                if (currentTime - fish.lastTapTime < 1000) { // Se o segundo toque ocorrer dentro de 1 segundo
                    fish.tapCount += 1;
                } else {
                    fish.tapCount = 1; // Reiniciar contagem de toques se muito tempo tiver passado
                }
                
                fish.lastTapTime = currentTime; // Armazena o último horário de toque
            
                if (fish.tapCount === 2 && !fish.resurfaced && !fish.resurfacing) {
                    fish.resurfacing = true; // Marca que o peixe está ressurgindo 
                    fish.isInvincible = true; // Ativa a invencibilidade

                    this.time.delayedCall(800, () => {
                        fish.isInvincible = false; // Desativa após 1 segundo
                    }, [], this);

                    this.resurfaceFish(fish); // Faz o peixe emergir


                //===========================
                // Resurfaced fish
                //===========================
                } else if (fish.tapCount === 1 && fish.resurfaced) { 
                    if (!fish.alreadyTapped) { 
                        fish.alreadyTapped = true; // Marca que o peixe foi tocado uma vez depois de emergir
                        
                        fishStopped = true; 
                        
                        //Congela o peixe
                        fish.stopped = true;
                        fish.anims.stop(); 
                        fish.speedX = 0; 
                        fish.speedY = 0; 

                        // Para o son do peixe nadando e toca o som de clique
                        this.fishSwimSound.stop();
                        this.fishClickSound.play();

                        // Incrementa a barra de progresso
                        this.progressBarFrame++;
                        if (this.progressBarFrame > 5) {
                            this.progressBarFrame = 5;
                        }

                        this.progressBar.setFrame(this.progressBarFrame);

                        // Mostra o botão "Next"
                        this.nextButton.setVisible(true); 
                        
                        //if (this.progressBarFrame === 5) {
                       //     this.restartButton.setVisible(true);
                        //}

                        // Crie o círculo
                        this.circle = this.add.image(fish.x, fish.y, 'circle')
                            .setScale(1.0)    
                            .setDepth(105);    
                    
                        // Determine a posição do círculo
                        const placement = this.determineInstructionPlacement(this.circle.x, this.circle.y, pointer.y);
                        
                        // Crie a seta
                        this.arrow = this.add.text(placement.arrowX, placement.arrowY, placement.arrowText, { fontSize: '32px', fill: '#fff', align: 'center' })
                            .setOrigin(0.5)         
                            .setDepth(105);   
                            
                        // Crie o texto de instrução
                        this.instructionText = this.add.text(placement.textX, placement.textY, 'Coloque o petisco\nno círculo', { fontSize: '32px', fill: '#fff', align: 'center' })
                            .setOrigin(0.5)  
                            .setDepth(105); 
                    }
                }
            }            
        });
        
         // Quando a barra de progresso estiver cheia, o jogo acaba
         if (this.progressBarFrame === 5) {
            this.gameOver = true;  // Define que o jogo acabou
            
            if (this.fishSpawnTimer) {
                this.fishSpawnTimer.remove(); // Remove o temporizador de spawn
            }
            
            // Percorrer todos os peixes e parar seus movimentos
            this.fishes.forEach(fish => {
                fish.stopped = true; // Impedir que o peixe continue se movendo
                fish.anims.stop();  // Parar a animação do peixe
                fish.speedX = 0;   // Impedir movimento horizontal
                fish.speedY = 0;  // Impedir movimento vertical
            });
        }        
    }
}


const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT
      },
    autoCenter: Phaser.Scale.CENTER_BOTH, // Centraliza o jogo
    width: window.innerWidth, // Ocupa toda a tela
    height: window.innerHeight, // Ocupa toda a tela
    scene: FishGame
};

const game = new Phaser.Game(config);
