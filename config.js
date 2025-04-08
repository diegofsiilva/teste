class Config extends Phaser.Scene {
  constructor() {
    super({ key: 'Config' });
  }

  preload() {
    // Load any assets needed for the config scene
    this.load.image('background', './assets/backAzul.png');
    this.load.image('fundoAzul', './assets/telaConfig.png');
  }

  create() {
    const { width, height } = this.game.config;
    const centerX = width / 2;
    
    this.somBotao = this.sound.add('somBotao')
    // Fundo que cobre toda a tela
    this.add.image(centerX, height / 2, 'backAzul')
        .setDisplaySize(width, height);

        
        // Imagem central
        this.add.image(centerX, height / 2, 'fundoAzul')
            .setScale(Math.min(width / 800, height / 600) * 1.0);

}
}