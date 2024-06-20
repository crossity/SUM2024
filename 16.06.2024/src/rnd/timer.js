export class Timer {
    constructor() {
        this.getTime = () => {
            const date = new Date();
            let t =
              date.getMilliseconds() / 1000.0 +
              date.getSeconds() +
              date.getMinutes() * 60;
            return t;
        };

        this.oldGlobalTime = this.getTime();
        this.frameCounter = 0;
        this.isPause = false;
        this.localTime = this.startTime = this.oldGlobalTime;
        this.globalTime = this.oldGlobalTime;
        this.globalDeltaTime = 0;
        this.localTime = this.globalTime;
        this.localDeltaTime = 0;
        this.pauseTime = 0;
    }

    update() {
        this.globalTime = this.getTime();
        this.globalDeltaTime = this.globalTime - this.oldGlobalTime;

        if (this.isPause) {
            this.localDeltaTime = 0;
            this.pauseTime += this.globalTime - this.oldGlobalTime;
        } else {
            this.localDeltaTime = this.globaLDeltaTime;
            this.localTime = this.globalTime - this.pauseTime - this.startTime;
        }

        this.oldGlobalTime = this.globalTime;
    }
}