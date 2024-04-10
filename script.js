document.addEventListener('DOMContentLoaded', function () {
    new Vue({
        el: '#app',
        data() {
            return {
                sectors: [
                    '💰', '250', '1000','500', '2000','500', '1000', '750',
                    '💩', '750','1000', '500', '2000', '500', '1000', '250'
                ],
                spinning: false,
                currentAngle: 0,
                winningSector: '',
                targetSectorIndex: 3, // Set to the index of the desired ending sector
            };
        },
        computed: {
            wheel() {
                const diameter = 350;
                const center = diameter / 2;
                return {
                    diameter,
                    radius: center - 2, // space for stroke
                    cx: center,
                    cy: center,
                };
            },
            sectorSize() {
                return 360 / this.sectors.length;
            },
        },
        created() {
            window.addEventListener('keydown', (event) => {
                if (this.spinning) return;

                switch (event.code) {
                    case 'ArrowLeft': this.move(false); break;
                    case 'ArrowRight': this.move(true); break;
                    case 'Space': this.spin(); break;
                }
            });
        },
        mounted() {
            anime.set(this.$refs.wheel, {
                rotate: this.currentAngle,
            });
        },
        methods: {
            polarToCartesian(centerX, centerY, radius, angleInDegrees) {
                var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
                return {
                    x: centerX + (radius * Math.cos(angleInRadians)),
                    y: centerY + (radius * Math.sin(angleInRadians)),
                };
            },
            getCurrentSector() {
                const normalizedAngle = (this.currentAngle % 360 + 360) % 360;
                const index = Math.floor(normalizedAngle / this.sectorSize);
                const adjustedIndex = index % this.sectors.length;
                return this.sectors[adjustedIndex];
            },
            getRandomInt(min, max) {
                min = Math.ceil(min);
                max = Math.floor(max);
                return Math.floor(Math.random() * (max - min + 1)) + min;
            },
            describeSector(index) {
                const { cx, cy, radius } = this.wheel;
                const startAngle = (index * this.sectorSize) - this.sectorSize / 2;
                const endAngle = startAngle + this.sectorSize;
                const start = this.polarToCartesian(cx, cy, radius, endAngle);
                const end = this.polarToCartesian(cx, cy, radius, startAngle);
                const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
                return [
                    "M", start.x, start.y,
                    "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
                    "L", cx, cy,
                    "Z"
                ].join(" ");
            },
            describeLabel(index) {
                const { cx, cy, radius } = this.wheel;
                const angle = index * this.sectorSize;
                const offset = 50; // Offset for label positioning
                const position = this.polarToCartesian(cx, cy, radius - offset, angle);
                const style = `transform-origin: ${position.x}px ${position.y}px; transform: rotate(${angle}deg);`;
                return { ...position, angle, style };
            },
            async move(sign) {
                this.currentAngle += sign ? -this.sectorSize : this.sectorSize;
                anime({
                    targets: this.$refs.wheel,
                    rotate: this.currentAngle,
                });
            },
            async spin() {
                const { sectorSize } = this;
                const awardIndex = this.targetSectorIndex;
                const awardAngleCenter = awardIndex * sectorSize;
                const turns = 10 * 360;
                const targetAngle = turns + awardAngleCenter;

                this.spinning = true;

                await anime({
                    targets: this.$refs.wheel,
                    duration: 10000,
                    rotate: -targetAngle,
                    easing: 'easeOutCirc'
                }).finished;

                this.currentAngle = -targetAngle % 360;

                anime.set(this.$refs.wheel, {
                    rotate: this.currentAngle,
                });

                this.spinning = false;
                this.winningSector = this.getCurrentSector();
                console.log(this.winningSector);

                let headerText;
                let pointsText = '';

                if (this.winningSector === '💩') {
                    headerText = "Better luck next time!";
                    document.querySelector('.headertext p').style.display = 'none';
                } else if (this.winningSector === '💰') {
                    headerText = "You hit the jackpot!";
                    pointsText = "You won 10.000 points";
                } else {
                    headerText = "You won!";
                    pointsText = `${this.winningSector} points`;
                }

                // Update the text content of h2 and p based on the winning sector
                document.querySelector('.headertext h2').textContent = headerText;
                if(pointsText) {
                    document.querySelector('.headertext p').style.display = ''; // Show p if it has content
                    document.querySelector('.headertext p').textContent = pointsText;
                }

                // Add classes to .mask-modal and .modal after the spin is done
                document.querySelector('.mask-modal').classList.add('active');
                document.querySelector('.modal').classList.add('modal-active');
                //Telegram.WebApp.MainButton.show();
                // Send the winning sector points to Telegram
                //Telegram.WebApp.sendData(JSON.stringify({ points: this.winningSector }));

                Telegram.WebApp.MainButton.show().onClick(function () {
                    const data = JSON.stringify({ points: this.winningSector });
                    Telegram.WebApp.sendData(points_data);
                    Telegram.WebApp.close();
                });
            },
            isEmoji(value) {
                const emojiPattern = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
                return emojiPattern.test(value);
            },
            getSectorFill(index) {
                if (this.sectors.length % 2 === 0) {
                    return index % 2 === 0 ? '#99c62e' : '#8CB62B';
                } else {
                    return '#8CB62B';
                }
            },
        },
    });
});