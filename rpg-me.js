import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { WiredCheckbox } from 'wired-elements/lib/wired-checkbox.js';


export class RpgMe extends DDDSuper(I18NMixin(LitElement)) {

  static get tag() {
    return "rpg-me";
  }

  constructor() {
    super();
    this.accessories = 0;
    this.base = 1;
    this.face = 0;
    this.faceitem = 0;
    this.hair = 0;
    this.pants = 0;
    this.shirt = 0;
    this.skin = 0;
    this.hatcolor = 0;
    this.hat = 'none';
    this.fire = false;
    this.walking = false;
    this.circle = false;
    this.loadFromUrl();
  }

  static get properties() {
    return {
      ...super.properties,
      title: { type: String },
      accessories: { type: Number },
      base: { type: Number },
      face: { type: Number },
      faceitem: { type: Number },
      hair: { type: Number },
      pants: { type: Number },
      shirt: { type: Number },
      skin: { type: Number },
      hatcolor: { type: Number },
      hat: { type: String },
      fire: { type: Boolean },
      walking: { type: Boolean },
      circle: { type: Boolean },
      seed: { type: String }
    };
  }

  static get styles() {
    return [super.styles,
    css`
      :host {
        display: block;
        color: var(--ddd-theme-primary);
        background-color: var(--ddd-theme-accent);
        font-family: var(--ddd-font-navigation);
      }
      .wrapper {
        margin: var(--ddd-spacing-2);
        padding: var(--ddd-spacing-4);
        display: grid;
      }

      .input-group {
        margin-bottom: var(--ddd-spacing-2);
      }

    `];
  }

  // Lit render the HTML
  render() {
    return html`
      <div class="wrapper">
          <div class="input-group">
            <wired-checkbox
            >Walking Animation</wired-checkbox>
          </div>

          <div class="input-group">
            <wired-checkbox
            >Circle Background</wired-checkbox>
        </div>
      </div>
    `;
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(RpgMe.tag, RpgMe);