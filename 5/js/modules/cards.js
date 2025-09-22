import {getResource} from '../services/services';
function cards() {
    class MenuCard {
        constructor(src, alt, title, descr, price, parentSelector, ...classes) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.classes = classes;
            this.parent = document.querySelector(parentSelector);
            this.transfer = 1; 
            this.changeToUSD();
        }

        changeToUSD() {
            this.price = this.price * this.transfer;
        }

        render() {
            const element = document.createElement('div');
            
            if (this.classes.length === 0) {
                this.classes = "menu__item";
                element.classList.add(this.classes);
            } else {
                this.classes.forEach(className => element.classList.add(className));
            }

            element.innerHTML = `
                <img src=${this.src} alt=${this.alt}>
                <h3 class="menu_item-subtitle">${this.title}</h3>
                <div class="menu_item-descr">${this.descr}</div>
                <div class="menu_item-divider"></div>
                <div class="menu_item-price">
                    <div class="menu_item-cost">Цена:</div>
                    <div class="menu_item-total"><span>${this.price}</span> USD/день</div>
                </div>
            `;
            this.parent.append(element);
        }
    }

    getResource('http://localhost:3001/menu')
        .then(data=> {
            data.forEach(({img, altimg, title, descr, price}) => {
                new MenuCard(img, altimg, title, descr, price, ".menu .container").render();
            });
        });
}

export default cards;