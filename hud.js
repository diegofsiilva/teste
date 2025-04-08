//Exibir o hud nas cenas jogáveis
class Hud extends Phaser.Scene {
    constructor() {
        super({ key: 'Hud'});
    }
    
    create() {
        console.log("aqui");

        const isMobile = this.game.device.os.android || this.game.device.os.iOS;
        const fontSize = isMobile ? '14px' : '24px';
        const buttonScale = isMobile ? 0.7 : 1;

        this.statusText = this.add.text(
            isMobile ? this.game.config.width / 20 : 50,
            this.game.config.height / 2,
            '',
            { fontSize: fontSize, fontFamily: 'titulo', color: '#FFFFFF' }
        ).setOrigin(0.5, 0.5).setRotation(Math.PI / 2);

        // Botão de sair
        //botão apertado
        this.botaoSair = this.add.image(this.game.config.width / 11, this.game.config.height / 10, 'botaoSair')
            .setScale(buttonScale)
            .setInteractive()
            .on('pointerdown', () => {
                this.somBotao.play();
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
            this.somBotao.play();
            this.timePressed = this.input.activePointer.getDuration() / 1000; //duração em segundos
            // Verificar se o botão seguro foi apertado por tempo suficiente
            if (this.progresso) {
                this.progresso.destroy();
            }
            if (this.timePressed > 1) {
                console.log("aqui")
                this.scene.stop(this.scene.key);
                this.sound.stopAll(); //para o som da cena
                this.scene.start('Escolha');
            }
        })

    }

}