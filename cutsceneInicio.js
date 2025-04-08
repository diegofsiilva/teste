class CutScene extends Phaser.Scene {
    constructor() {
        super({ key: 'CutScene' });
    }

    preload() {
        //carregando assests da cutscene
        this.load.image('bgInicio', "assets/bgCutScene.png");
        this.load.image('xu', "assets/xu.svg");
        this.load.image('saque', "assets/saque.svg");
        this.load.image('monalisa', "assets/monalisa.svg");
        this.load.image('rabito', "assets/rabito.svg");
        this.load.image('logo', "assets/logo.png");
    
        //carregando assets das próximas cenas
            //Background da tela inicial
            this.load.image('background', 'assets/fundo_inicial.png');
            // Botão de iniciar
            this.load.image('botaoInicial', 'assets/botao_inicial.svg');
            // Botão de reiniciar
            this.load.image('botaoReiniciar', 'assets/botaoReiniciar.svg');
            //Spritesheet do peixe
            this.load.spritesheet('peixe', 'assets/orangeFish.png', {
                frameWidth: 320, // Largura de cada frame
                frameHeight: 320 // Altura de cada frame
            });
            // Carregando a imagem do círculo
            this.load.image('circulo', 'assets/circulo.png');
            //Background da água
            this.load.image('mundoAgua', 'assets/mundo_da_agua.png');
            //Botão de continuar
            this.load.image('botaoContinuar', 'assets/botao_continuar.png');
            //Mapa
            this.load.image('mapa', 'assets/mapa.png');
            //Imagem de boas-vindas
            this.load.image('boasVindas', 'assets/boasVindas.png');
            //Imagens de instrução
            this.load.image('instrucaoEtapaUm', 'assets/instrucaoEtapaUm.svg');
            this.load.image('instrucaoEtapaDois', 'assets/instrucaoEtapaDois.svg');
            this.load.image('inicioMundoAgua', 'assets/inicioMundoAgua.svg');
    
            //Background floresta
            this.load.image('floresta', 'assets/backgroundFloresta.png');
            // Carregando o spritesheet do peixe preto
            this.load.spritesheet('darkFish', 'assets/darkFish.png', { frameWidth: 320, framHeight: 320 });
            // Carregando o spritesheet do peixe laranja
            this.load.spritesheet('orangeFish', 'assets/orangeFish.png', { frameWidth: 320, frameHeight: 320 });
            // Carregando o spritesheet do peixe azul
            this.load.spritesheet('blueFish', 'assets/blueFish.png', { frameWidth: 320, frameHeight: 320 });
            // Carregando o spritesheet do peixe verde
            this.load.spritesheet('greenFish', 'assets/greenFish.png', { frameWidth: 320, frameHeight: 320 });
            // Botão próxima etapa
            this.load.image('proximaEtapa', 'assets/proximaEtapa.svg')
            // Final água
            this.load.image('fimAgua', 'assets/fimAgua.png');
            //Inicio água
            this.load.image('inicioAgua', 'assets/inicioAgua.png');
            //aviso horizontal
            this.load.image('avisoHorizontal', 'assets/avisoHorizontal.svg')
            //Personagens
            this.load.image('rabito', 'assets/rabito.svg');
            this.load.image('xu', 'assets/xu.svg');
            this.load.image('monalisa', 'assets/monalisa.svg');
            this.load.image('saque', 'assets/saque.svg');
            //Retângulos personalizados
            this.load.image('retanguloAzul', 'assets/retanguloAzul.svg');
            //Botão de sair
            this.load.image('botaoSair', 'assets/botaoSair.svg');
            this.load.image('botaoIniciarFase', 'assets/botaoIniciarFase.png');
    
    
            //Audios
            //Botão
            this.load.audio('somBotao', 'assets/sound/clique_botao.mp3');
            //Peixe nadando
            this.load.audio('somPeixeNado', 'assets/sound/movimentacao_peixe.mp3');
            //Clique no peixe
            this.load.audio('somPeixeClique', 'assets/sound/clique_peixe.mp3');
            //Trilha sonora
            this.load.audio('musicaFundo', 'assets/sound/trilha_sonora.mp3');
    
            //Subsolo
            this.load.spritesheet('barata', 'assets/barata.svg', { frameWidth: 1456/8 , frameHeight: 300 });
            this.load.image('buraco', 'assets/buraco.svg');
            this.load.image('fimSubsolo', 'assets/fimSubsolo.svg');
            this.load.image('inicioSubsolo', 'assets/inicioSubsolo.svg');
            this.load.image('mundoSubsolo', 'assets/backgroundSubsolo.svg');
            //Audio
            this.load.audio('movimentacaoBarata', 'assets/sound/movimentacao_barata.mp3');
            this.load.audio('cliqueBarata', 'assets/sound/clique_barata.mp3')
        

            //Background floresta
            this.load.image('floresta', 'assets/backgroundFloresta.png');
            // Carregando o spritesheet do peixe preto
            this.load.spritesheet('darkFish', 'assets/darkFish.png', { frameWidth: 320, framHeight: 320 });
            // Carregando o spritesheet do peixe laranja
            this.load.spritesheet('orangeFish', 'assets/orangeFish.png', { frameWidth: 320, frameHeight: 320 });
            // Carregando o spritesheet do peixe azul
            this.load.spritesheet('blueFish', 'assets/blueFish.png', { frameWidth: 320, frameHeight: 320 });
            // Carregando o spritesheet do peixe verde
            this.load.spritesheet('greenFish', 'assets/greenFish.png', { frameWidth: 320, frameHeight: 320 });
            // Botão próxima etapa
            this.load.image('proximaEtapa', 'assets/proximaEtapa.svg')
            // Final água
            this.load.image('fimAgua', 'assets/fimAgua.png');
            //Inicio água
            this.load.image('inicioAgua', 'assets/inicioAgua.png');
            //aviso horizontal
            this.load.image('avisoHorizontal', 'assets/avisoHorizontal.svg')
            //Personagens
            this.load.image('rabito', 'assets/rabito.svg');
            this.load.image('monalisa', 'assets/monalisa.svg');
            this.load.image('saque', 'assets/saque.svg');
            //Retângulos personalizados
            this.load.image('retanguloAzul', 'assets/retanguloAzul.svg');
            //Botão de sair
            this.load.image('botaoSair', 'assets/botaoSair.svg');
            this.load.image('botaoIniciarFase', 'assets/botaoIniciarFase.png');
    
    
            //Audios
            //Botão
            this.load.audio('somBotao', 'assets/sound/clique_botao.mp3');
            //Peixe nadando
            this.load.audio('somPeixeNado', 'assets/sound/movimentacao_peixe.mp3');
            //Clique no peixe
            this.load.audio('somPeixeClique', 'assets/sound/clique_peixe.mp3');
            //Trilha sonora
            this.load.audio('musicaFundo', 'assets/sound/trilha_sonora.mp3');
    
            //Subsolo
            this.load.spritesheet('barata', 'assets/barata.svg', { frameWidth: 1456/8 , frameHeight: 300 });
            this.load.image('buraco', 'assets/buraco.svg');
            this.load.image('fimSubsolo', 'assets/fimSubsolo.svg');
            this.load.image('inicioSubsolo', 'assets/inicioSubsolo.svg');
            this.load.image('mundoSubsolo', 'assets/backgroundSubsolo.svg');
            //Audio
            this.load.audio('movimentacaoBarata', 'assets/sound/movimentacao_barata.mp3');
            this.load.audio('cliqueBarata', 'assets/sound/clique_barata.mp3')
        }

    create() {
        //variável que será usada no update
        this.delaysAdded = false;
        //variável para movimentação, usada no update
        this.mov = true

          //deixa em tela cheia ao clicar sobre a tela
          this.input.once('pointerdown', () => {
            this.scale.startFullscreen();
        });

        
          //adiciona responsividade
          const isMobile = this.game.device.os.android || this.game.device.os.iOS;
        const petScale = isMobile ? 0.7 : 1;
        const logoScale = isMobile ? 0.5 : 1;
        const bgScale = isMobile ? 0.6 : 0.8; 
      
        //posições dos animais
        const xuX = this.game.config.width * (875 / 1160);
        const xuY = this.game.config.height * (395 / 568);

        const saqueX = this.game.config.width * (685 / 1160);
        const saqueY = this.game.config.height * (410 / 568);

        const rabitoX = this.game.config.width * (485 / 1160);
        const rabitoY = this.game.config.height * (425 / 568);

        const monalisaX = this.game.config.width * (275 / 1160);
        const monalisaY = this.game.config.height * (435 / 568);

        // Criar um tileSprite que cobre a tela e pode rolar
        this.bgInicio = this.add.tileSprite(this.game.config.width / 2, this.game.config.height / 2, 1600, 1200, 'bgInicio').setScale(bgScale);
    

        //carrega os assets dos animais, mas os deixa não visíveis
        this.xu = this.add.image(xuX, xuY, 'xu').setScale(petScale).setVisible(false);
        this.saque = this.add.image(saqueX, saqueY , 'saque').setScale(petScale).setVisible(false);
        this.rabito = this.add.image(rabitoX, rabitoY, 'rabito').setScale(petScale).setVisible(false);
        this.monalisa = this.add.image(monalisaX, monalisaY, 'monalisa').setScale(petScale).setVisible(false);

        this.logo = this.add.image(this.game.config.width / 2, this.game.config.height / 2.38, 'logo').setScale(logoScale).setVisible(false).setInteractive();

        //Adiciona os sons
        this.mainSound = this.sound.add('musicaFundo'); //trilha sonora
        this.mainSound.play(); //ativar o som


        //Adiciona os sons
        this.mainSound = this.sound.add('musicaFundo'); //trilha sonora
        this.mainSound.play(); //ativar o som
        this.somBotao = this.sound.add('somBotao'); //som de clique do botão

        //cor de fundo
        this.cameras.main.setBackgroundColor(0x221F59);

        //texto para clicar
        this.texto = this.add.text(this.game.config.width / 2, this.game.config.height / 1.06, 'Toque na tela para começar', {
            fontFamily: 'titulo', 
            fontSize: '32px', 
            color: '#fff'
        }).setOrigin(0.5, 0.5).setVisible(false);

          //Verificar se o jogo está na escala retrato
          if(game.scale.isPortrait){
            this.add.image(this.game.config.width/2, this.game.config.height/2, 'avisoHorizontal')
            .setScale(0.7);
        }
    

    }

    update() {
        // Verifica se ainda não atingiu o limite superior
        if (this.bgInicio.tilePositionY <= 830) { 
            this.mov = this.bgInicio.tilePositionY += 7; // Move para cima

        }
        //atribui falso para o movimento, parando-o
        else {(this.mov = false)
        }
        //se o movimento parou (false), torna o delaysAdded true
        if (!this.delaysAdded && !this.mov) {
            this.delaysAdded = true;

        //delay para adicionar o primeiro animal

           this.time.delayedCall(200, () => {

           this.xu.setVisible(true)
           this.somBotao.play();
        });
 
        //delay para adicionar os outros animais
           this.time.delayedCall(700, () => {

            this.saque.setVisible(true)
           this.somBotao.play();
           
        });
        
           this.time.delayedCall(1300, () => {
            this.rabito.setVisible(true)
           this.somBotao.play();
        });
           this.time.delayedCall(1900, () => {
            this.monalisa.setVisible(true)
           this.somBotao.play();
        });

        //delay que adiciona a logo
        this.time.delayedCall(2000, () => {

            this.logo.setVisible(true);
            this.somBotao.play();
        //efeito da logo
            this.tweens.add({
                targets: this.logo,
                scale: { from: 0, to: 0.6 }, // Cresce de 0.6
                duration: 1000,
                ease: 'Back.Out'
            });
        });
        //delay para adicionar o texto de clique
        this.time.delayedCall(2000, () => {

            this.texto.setVisible(true);

            
        // Evento de clique para iniciar o jogo
        this.input.on('pointerdown', () => {
            this.somBotao.play();
            this.scale.startFullscreen();
            this.scene.start('Escolha'); // Comando para ir para outra cena
        
    })
        });
        
        }
    }
}

 
