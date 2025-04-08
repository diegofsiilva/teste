class ConclusaoFase extends Phaser.Scene {
    constructor() {
        super({ key: 'ConclusaoFase' });
        this.animationComplete = false; // Flag para controlar o término
    }

    preload() {
        //Estrela
        this.load.image('star', 'assets/star.png');
    }

    create() {
        this.animationComplete = false; // Flag para controlar o término
        // === CONFIGURAÇÃO DA PRIMEIRA ESTRELA ===
        this.xi1 = 0;
        this.yi1 = this.sys.game.config.height - 50;
        this.xf1 = this.sys.game.config.width;
        this.yf1 = 0;
        this.T = 3;

        this.vx1 = (this.xf1 - this.xi1) / this.T;
        this.ay1 = 2 * (this.yf1 - this.yi1) / (this.T * this.T);
        this.startTime1 = this.time.now;

        this.sprite1 = this.add.image(this.xi1, this.yi1, 'star');
        this.sprite1.setScale(0.3);

        // === CONFIGURAÇÃO DA SEGUNDA ESTRELA (ESPELHADA) ===
        this.xi2 = this.sys.game.config.width;
        this.yi2 = this.sys.game.config.height - 50;
        this.xf2 = 0;
        this.yf2 = 0;

        this.vx2 = -this.vx1;
        this.ay2 = this.ay1;
        this.startTime2 = this.time.now;

        this.sprite2 = this.add.image(this.xi2, this.yi2, 'star');
        this.sprite2.setScale(0.3);

        // === CONFIGURAÇÃO DE DEBUG/RASTRO ===
        this.graphics = this.add.graphics({ lineStyle: { width: 2, color: 0x00ff00 } });
        this.positions1 = [];
        this.positions2 = [];

        console.log("=== DADOS INICIAIS ===");
        console.log(`1ª Estrela: Início (${this.xi1}, ${this.yi1}) -> Fim (${this.xf1}, ${this.yf1})`);
        console.log(`2ª Estrela: Início (${this.xi2}, ${this.yi2}) -> Fim (${this.xf2}, ${this.yf2})`);
        console.log(`Duração: ${this.T}s | Vel.X: ${this.vx1.toFixed(2)}px/s | Acel.Y: ${this.ay1.toFixed(2)}px/s²`);
    }

    update(time, delta) {
        console.log("no update do hud")
        // Se a animação já completou, não faz mais nada
        if (this.animationComplete) {this.scene.stop('ConclusaoFase')};

        // === ATUALIZAÇÃO DA PRIMEIRA ESTRELA ===
        let t1 = (time - this.startTime1) / 1000;
        let x1 = this.xi1 + this.vx1 * t1;
        let y1 = this.yi1 + 0.5 * this.ay1 * t1 * t1;

        if (t1 <= this.T) {
            console.table([{
                "Estrela": "1ª",
                "Tempo": t1.toFixed(2) + "s",
                "Pos.X": x1.toFixed(1),
                "Pos.Y": y1.toFixed(1),
                "Vel.X": this.vx1.toFixed(2),
                "Vel.Y": (this.ay1 * t1).toFixed(2),
                "Acel.Y": this.ay1.toFixed(2)
            }]);
        }

        this.sprite1.setPosition(x1, y1);
        this.positions1.push({ x: x1, y: y1 });

        // === ATUALIZAÇÃO DA SEGUNDA ESTRELA ===
        let t2 = (time - this.startTime2) / 1000;
        let x2 = this.xi2 + this.vx2 * t2;
        let y2 = this.yi2 + 0.5 * this.ay2 * t2 * t2;

        this.sprite2.setPosition(x2, y2);
        this.positions2.push({ x: x2, y: y2 });

          // === DESENHO DOS RASTROS ===
        // this.graphics.clear();
        // this.graphics.beginPath();
        // this.positions1.forEach((pos, index) => {
        //     if (index === 0) {
        //         this.graphics.moveTo(pos.x, pos.y);
        //     } else {
        //         this.graphics.lineTo(pos.x, pos.y);
        //     }
        // });
        // this.positions2.forEach((pos, index) => {
        //     if (index === 0) {
        //         this.graphics.moveTo(pos.x, pos.y);
        //     } else {
        //         this.graphics.lineTo(pos.x, pos.y);
        //     }
        // });
        // this.graphics.strokePath();

        // === VERIFICAÇÃO DE TÉRMINO ===

        if (t1 >= this.T && t2 >= this.T && !this.animationComplete) {
            this.animationComplete = true;
            console.log("Animação completada");
            console.log(`Dimensões da tela: ${this.sys.game.config.width}x${this.sys.game.config.height}`);
            // Garante que as estrelas ficaram nas posições finais exatas
            this.sprite1.setPosition(this.xf1, this.yf1)
                .destroy();
            this.sprite2.setPosition(this.xf2, this.yf2)
                .destroy();
        }
    }
}
