//Cena para criar o peixe
class Peixe extends Phaser.Scene{
    constructor(){
        super({key: 'Peixe'});
    }

    create(){
        this.createFishAnimations();
         //Adicionar som
         this.nado = this.sound.add('somPeixeNado');
    }

    update(){
        //Parar o som de nado
        if (!this.activeFish) {
            this.nado.stop();
        }
    }

    // Função para criar as animações do peixe
    createFishAnimations() {
        this.anims.create({
            key: 'nadar', // Nome da animação
            frames: this.anims.generateFrameNumbers('peixe', { start: 0, end: 7 }), // Frames da animação
            frameRate: 10, // Velocidade da animação
            repeat: -1 // Repetição infinita
        });
    }

     // Função para gerar um novo peixe
     spawnFish() {
        // Verifica se já existe um peixe ativo
        if (this.activeFish) {
            this.activeFish.destroy(); // Destrói o peixe anterior, se houver
            this.activeFish = null;
        }

        // Cria um novo peixe fora da tela à direita
        this.activeFish = this.add.sprite(
            this.game.config.width + 320, // Posiciona completamente fora da tela (considerando a largura do peixe)
            Phaser.Math.Between(100, this.game.config.height - 100), // Posição Y aleatória
            'peixe'
        );

        // Inicializando o peixe
        this.initFish(this.activeFish);

        //Definir área clicável
        this.clickable = this.add.rectangle(this.game.config.width / 8 + ((this.game.config.width - this.game.config.width / 8) / 2), this.game.config.height / 2, 7 * this.game.config.width / 8, this.game.config.height, 0xFFFFFF, 0)
            .setInteractive()
            .on('pointerdown',
                this.showRewardMessage,
                this
            );
        //this.input.on('pointerdown', this.showRewardMessage, this); //Chama a função que mostra a mensagem de recompensa, após clicar na tela

    }

    // Função para inicializar o peixe
    initFish(fish) {
        fish.setScale(0.8); // Definindo a escala do peixe
        fish.play('nadar'); // Iniciando a animação de nado
        fish.angle = Phaser.Math.Between(-60, 60); // Definindo um ângulo inicial aleatório
        fish.stopped = false; // Marcando que o peixe não está parado
        this.updateFishSpeed(fish); // Atualizando a velocidade do peixe
        fish.nextTurnTime = this.time.now + Phaser.Math.Between(1000, 3000); // Definindo o tempo para a próxima curva
        fish.lastDirectionChange = 0; // Resetando o tempo da última mudança de direção
        //Som de nado
        //this.nado.loop = true;
        //this.nado.play();
    }

    // Função para atualizar a velocidade do peixe
    updateFishSpeed(fish) {
        const radians = Phaser.Math.DegToRad(fish.angle); // Convertendo o ângulo para radianos
        fish.speedX = Math.cos(radians) * -5; // Movimento para a esquerda
        fish.speedY = -Math.sin(radians) * 3; // Movimento vertical
    }
}