class CockroachGame extends Phaser.Scene {
    constructor() {
        super({ key: 'CockroachGame' });
        this.cockroach = null;
        this.sinkhole = null;
        this.gameOver = false;
        this.cont = 0;
        this.deleteButton = false;
        this.transition = true;
    }
  

    // Função de pré-carregamento de recursos.
    preload() {
        this.load.spritesheet('cockroach', 'assets/cockroach.png', { frameWidth: 182, frameHeight: 300 });
        this.load.image('sinkhole', 'assets/sinkhole.png');
        this.load.image('telaTransicaoBueiro', 'assets/extras/telaTransicaoFloresta.png');
        this.load.image('buton', 'assets/extras/botao_continuar.png')
        this.load.image('telaFimBueiro','assets/extras/telaFimFloresta.png' )
        this.load.image('botaoIniciarFase', 'assets/extras/botaoIniciarFase.png')
        this.load.image('botaoReiniciar', 'assets/extras/botaoReiniciar.png')
    }
  

    // Função de criação de elementos
    create() {
        console.log(this.cont);
        this.cameras.main.setBackgroundColor('#895129');
        this.gameOver = false;

        // Cria o cockroach e inicia o cooldown do buraco.
        this.createCockroach();
  
        // Habilita a colisão com as bordas do mundo.
        this.cockroach.setCollideWorldBounds(true);
        this.cockroach.body.onWorldBounds = true;
        
        // Adiciona um evento para detectar colisões com as bordas do mundo.
        this.physics.world.on('worldbounds', (body) => {
            if (body.gameObject === this.cockroach && !this.gameOver) {
                if (this.cockroach.isChasing && this.sinkhole) {
                    // Se o cockroach estiver perseguindo um buraco e colidir com a borda do mundo,
                    this.cockroach.isChasing = true;
                    this.cockroach.speed = 200 * 2; // Aumenta a velocidade do cockroach.
                    this.cockroach.nextTurnTime = this.time.now + Phaser.Math.Between(1000, 3000);
                } else {
                    let currentAngle = Phaser.Math.DegToRad(this.cockroach.angle - 90);
                    let variation = Phaser.Math.FloatBetween(-45 * Math.PI / 180, 45 * Math.PI / 180);
                    let newAngle = currentAngle + Math.PI + variation;
                    let newAngleDeg = Phaser.Math.RadToDeg(newAngle) + 90;
                    this.smoothTurn(this.cockroach, newAngleDeg);
                }
            }
        });

        const isMobile = game.device.os.android || game.device.os.iOS;
        const fontSize = isMobile ? '14px' : '24px';
        const buttonScale = isMobile ? 0.7 : 1;
        
        //const buttonScale = 0.7; // Adjust this value as necessary

        // Botão de sair - Adding the exit button.
        this.botaoSair = this.add.image(this.game.config.width / 11, this.game.config.height / 10, 'botaoSair')
        .setInteractive()
        .on('pointerdown', () => {
            //Adicionar barra de progresso para sair da tela
            this.progresso = this.add.rectangle(this.game.config.width / 23, this.game.config.height / 25, 10, 20, 0x00FF00)
                .setOrigin(0.5, 0);
            //Barra de progresso aumentando
            this.tweens.add({
                targets: this.progresso,
                scaleY: 3,
                duration: 1200,
                ease: 'Power2'
            });
        })

        //botão deixa de ser apertado
        this.botaoSair.on('pointerup', () => {
            this.timePressed = this.input.activePointer.getDuration() / 1000; //duração em segundos
            // Verificar se o botão seguro foi apertado por tempo suficiente
            if (this.timePressed > 1) {
                console.log("aqui")
                this.scene.stop('Ceu');
                this.sound.stopAll(); //para o som da cena
                this.scene.start('Inicial');
            }
        });
        
        this.showTransition()
        // Inicia o cooldown para o próximo buraco.
        this.startSinkholeCooldown();
    }
  

    // Função para mostrar a tela de transição.
    showTransition(){
        if (this.cont == 0){
            this.back = this.add.image(this.game.config.width / 2, (this.game.config.height / 2) + 15, 'telaTransicaoBueiro').setScale(0.9)
            this.buton = this.add.image(this.game.config.width / 15, this.game.config.height / 2, 'botaoIniciarFase').setScale(0.9);
            this.buton.setInteractive()
            this.buton.on('pointerdown', ()=> 
            this.removeTransition()
            );
        } 
    }


    // Função para remover a tela de transição.
    removeTransition(){
        this.back.destroy()
        this.buton.destroy()
    }


    // Função para mostrar a tela de finalização.
    showFinalization(){
        this.add.image(this.game.config.width / 2, this.game.config.height / 2, 'telaFimBueiro').setScale(0.9);
        this.butonReiniciar = this.add.image(this.game.config.width / 15, this.game.config.height / 5, 'botaoReiniciar').setScale(0.9);
        this.butonReiniciar.setInteractive()
            this.butonReiniciar.on('pointerdown', ()=> 
            this.scene.restart()
            );
        this.buton = this.add.image(this.game.config.width / 15, this.game.config.height / 1.75, 'botaoIniciarFase').setScale(0.9);
            this.buton.setInteractive()
            this.buton.on('pointerdown', ()=> 
            this.scene.start('Mapa')
            );
    }


    // Função para criar um cockroach.
    createCockroach() {
        // Cria um cockroach em uma posição aleatória.
        const randomX = Phaser.Math.Between(0, this.game.config.width);
        const randomY = Phaser.Math.Between(0, this.game.config.height);
        this.cockroach = this.physics.add.sprite(randomX, randomY, 'cockroach');

        // Define a escala e origem do cockroach.
        this.cockroach.setScale(0.7);
        this.cockroach.setOrigin(0.5, 0.5);

        // Adiciona um corpo físico ao cockroach.
        this.cockroach.alpha = 0;
        this.tweens.add({
        targets: this.cockroach,
        alpha: 1,
        duration: 500
        });

        // Cria a animação de movimento do cockroach.
        if (!this.anims.get('crawl')) {
            this.anims.create({
                key: 'crawl',
                frames: this.anims.generateFrameNumbers('cockroach', { start: 0, end: 7 }),
                frameRate: 12,
                repeat: -1
                });
        } 
        this.cockroach.play('crawl');
  
        // Define a velocidade e ângulo iniciais do cockroach.
        this.cockroach.angle = Phaser.Math.Between(-60, 60);
        this.cockroach.speed = 200;

        // Flag para indicar se o cockroach está perseguindo um buraco.
        this.cockroach.isChasing = false;

        // Flag para indicar se o cockroach está desaparecendo.
        this.cockroach.fading = false;

        // Define o tempo para o próximo movimento aleatório.
        this.cockroach.nextTurnTime = this.time.now + Phaser.Math.Between(1000, 3000);
  
        // Se o cockroach for clicado, o jogo termina.
        this.cockroach.setInteractive();
        this.cockroach.on('pointerdown', () => {
            this.endGame();
        });

        // Finaliza o jogo quando o cockroach é tocado
        this.cockroach.on('pointerdown', () => {
            this.cont += 1;
            if (this.cont == 3) {
                this.cockroach.destroy()
                this.cont = 0;
                this.showFinalization()
            } else {
                this.showCircle();
                this.endGame();
                this.showContinueButton();
             }
        });
    }
  

    // Função de atualização do jogo.
    update(time, delta) {
        if (this.gameOver) return;
  
        if (this.cockroach) {
            // Se o cockroach não estiver perseguindo um buraco, faça movimentos aleatórios.
            if (!this.sinkhole && !this.cockroach.isChasing) {
                if (time >= this.cockroach.nextTurnTime) {
                    let randomAngle = Phaser.Math.Between(-60, 60);
                    this.smoothTurn(this.cockroach, randomAngle);
                    this.cockroach.nextTurnTime = time + Phaser.Math.Between(1000, 3000);
                }
            }

            // Movimenta o cockroach na direção do ângulo atual.
            // Subtrai 90° para ajustar a orientação do sprite.
            let rad = Phaser.Math.DegToRad(this.cockroach.angle - 90);
            this.cockroach.body.setVelocity(
                Math.cos(rad) * this.cockroach.speed,
                Math.sin(rad) * this.cockroach.speed
            );
  
            // Se o cockroach estiver perseguindo um buraco, ajuste a velocidade.
            if (this.sinkhole) {
                let dist = Phaser.Math.Distance.Between(this.cockroach.x, this.cockroach.y, this.sinkhole.x, this.sinkhole.y);
                if (dist < 30 && !this.cockroach.fading) { // Só se aproxima se não estiver desaparecendo.
                    this.cockroach.fading = true; // Desaparece após colidir.
                    this.tweens.add({
                        targets: this.cockroach,
                        alpha: 0,
                        duration: 100,
                        onComplete: () => {
                            // Se o buraco ainda existir, remova-o.
                            if (this.sinkhole) {
                                this.sinkhole.destroy();
                                this.sinkhole = null;
                            }

                            // Se o cockroach ainda existir, remove e crie um novo.
                            this.cockroach.destroy();
                            this.cockroach = null;
                            this.spawnNewCockroach();
                            this.startSinkholeCooldown();
                        }
                    });
                }
            }
        }
    }
  
    
    // Função para suavizar a rotação do sprite.
    smoothTurn(sprite, newAngle) {
        this.tweens.add({
            targets: sprite,
            angle: newAngle,
            duration: 500
        });
    }
  

    // Inicia o cooldown para o próximo buraco.
    startSinkholeCooldown() {
        if (this.gameOver) return;
        let cooldown = Phaser.Math.Between(2000, 5000); // em milissegundos
        this.time.delayedCall(cooldown, () => {
            this.spawnSinkhole();
        });
    }
  

    // Função para criar um buraco.
    spawnSinkhole() {
        if (this.sinkhole || this.gameOver || !this.cockroach) return;
  
        // Determine se o buraco deve aparecer no mesmo quadrante que o cockroach.
        let cockroachQuadrant = this.getQuadrant(this.cockroach.x, this.cockroach.y);

        // Escolhe um quadrante aleatório diferente do do cockroach.
        let availableQuadrants = ['topLeft', 'topRight', 'bottomLeft', 'bottomRight'].filter(q => q !== cockroachQuadrant);
        let chosenQuadrant = Phaser.Utils.Array.GetRandom(availableQuadrants);

        // Pega uma posição aleatória dentro do quadrante escolhido.
        let pos = this.getRandomPositionInQuadrant(chosenQuadrant);
  
        // Cria o buraco na posição aleatória.
        this.sinkhole = this.add.image(pos.x, pos.y, 'sinkhole');

        // Set scale para o buraco.
        this.sinkhole.setScale(0.7);
        this.sinkhole.setInteractive();
  
        // Adiciona um evento de duplo clique para remover o buraco.
        this.sinkhole.tapCount = 0;
        this.sinkhole.lastTapTime = 0;
        this.sinkhole.on('pointerdown', () => {
            let currentTime = this.time.now;
            if (currentTime - this.sinkhole.lastTapTime < 500) {
                this.removeSinkhole();
            }
            this.sinkhole.lastTapTime = currentTime;
        });
  
        // Depois de 500ms, o cockroach começa a perseguir o buraco.
        this.time.delayedCall(500, () => {
            if (this.cockroach && this.sinkhole) {
                this.cockroach.isChasing = true;

                // Aumenta a velocidade do cockroach enquanto persegue o buraco.
                this.cockroach.speed = 200 * 2;

                // Cancela qualquer tween de rotação em andamento.
                this.tweens.killTweensOf(this.cockroach);

                // Ajusta a rotação do cockroach para apontar para o buraco.
                let angleToSinkhole = Phaser.Math.RadToDeg(
                    Phaser.Math.Angle.Between(this.cockroach.x, this.cockroach.y, this.sinkhole.x, this.sinkhole.y)
                );
                this.cockroach.angle = angleToSinkhole + 90;
            }
        });
    }
  

    // Função para remover o buraco.
    removeSinkhole() {
        if (!this.sinkhole) return;
        this.sinkhole.destroy();
        this.sinkhole = null;
        // Se o cockroach estiver perseguindo o buraco, pare de perseguir.
        if (this.cockroach) {
            this.cockroach.isChasing = false;
            this.cockroach.speed = 200;
        }
        this.startSinkholeCooldown();
    }
  

    // Função para criar um novo cockroach.
    spawnNewCockroach() {
        if (this.gameOver) return;
        this.createCockroach();
        this.cockroach.setCollideWorldBounds(true);
        this.cockroach.body.onWorldBounds = true;
    }
  

    // Função para determinar o quadrante de uma posição.
    getQuadrant(x, y) {
        let width = this.game.config.width;
        let height = this.game.config.height;
        if (x < width / 2 && y < height / 2) return 'topLeft';
        if (x >= width / 2 && y < height / 2) return 'topRight';
        if (x < width / 2 && y >= height / 2) return 'bottomLeft';
        return 'bottomRight';
    }
  

    // Função para obter uma posição aleatória dentro de um quadrante
    getRandomPositionInQuadrant(quadrant) {
        let margin = 75; // Margem de segurança para evitar que o buraco fique muito perto da borda.
        let width = this.game.config.width;
        let height = this.game.config.height;
        let x, y;
        switch (quadrant) {
            case 'topLeft':
                x = Phaser.Math.Between(margin, (width / 2) - margin);
                y = Phaser.Math.Between(margin, (height / 2) - margin);
                break;
            case 'topRight':
                x = Phaser.Math.Between((width / 2) + margin, width - margin);
                y = Phaser.Math.Between(margin, (height / 2) - margin);
                break;
            case 'bottomLeft':
                x = Phaser.Math.Between(margin, (width / 2) - margin);
                y = Phaser.Math.Between((height / 2) + margin, height - margin);
                break;
            case 'bottomRight':
                x = Phaser.Math.Between((width / 2) + margin, width - margin);
                y = Phaser.Math.Between((height / 2) + margin, height - margin);
                break;
        }
        return { x, y };
    }
    

    showCircle() {
        this.circle = this.add.image(
            this.cockroach.x,
            this.cockroach.y,
            'circulo'
        ).setScale(this.game.config.width / 2000);
    }


    showContinueButton() {
        const buttonY = this.game.config.height / 2;
        const buttonX = this.game.config.width / 7;

        // Adicionando o botão de imagem
        this.botaoContinuar = this.add.image(buttonX, buttonY, 'botaoContinuar')
            .setOrigin(0.5)
            .setInteractive()
            .setRotation(Math.PI / 2)
            .setScale(this.game.config.width / 1280);

        this.botaoContinuar.on('pointerdown', () => this.handleContinue());
    }


    // Função para tratar o clique no botão "CONTINUAR"
    handleContinue() {
        this.continuarPressionado = true;
        this.botaoContinuar.destroy();

        if (this.circleVisible) {
            this.circle.destroy();
            this.statusText.setText('');
            this.circleVisible = false;
        }

        this.awaitingContinue = false;
        this.scene.restart();
    }
  

    // Função para terminar o jogo.
    endGame() {
        this.gameOver = true;
        // Pause physics and timers.
        this.physics.pause();
        this.time.paused = true;
        // Freeze the cockroach animation.
        if (this.cockroach) {
            this.cockroach.anims.pause();
        }
    }
}


// Configurações do jogo.
const config = {
    type: Phaser.AUTO,
    scene: CockroachGame,
    physics: {
        default: 'arcade',
        arcade: { debug: false }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: window.innerWidth,
        height: window.innerHeight
    }
};


// Inicializa o jogo.
const game = new Phaser.Game(config);
  