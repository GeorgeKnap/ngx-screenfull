import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NgxScreenfullService {

  keyboardAllowed = typeof Element !== 'undefined' && 'ALLOW_KEYBOARD_INPUT' in Element;
  get isFullscreen() {
    return Boolean(document[this.fn.fullscreenElement]);
  }

  private fn: any;
  private eventNameMap: { change: () => {}; error: () => {} };

  constructor() {
    this.fn = this.init();
    this.eventNameMap = {
      change: this.fn.fullscreenchange,
      error: this.fn.fullscreenerror
    };
  }

  toggle(elem: HTMLElement) {
    return this.isFullscreen ? this.exit() : this.request(elem);
  }

  request(element: HTMLElement) {
    return new Promise((resolve) => {
      const request = this.fn.requestFullscreen;

      const onFullScreenEntered = () => {
        this.off('change', onFullScreenEntered);
        resolve();
      };

      element = element || document.documentElement;

      // Work around Safari 5.1 bug: reports support for
      // keyboard in fullscreen even though it doesn't.
      // Browser sniffing, since the alternative with
      // setTimeout is even worse.
      if (/ Version\/5\.1(?:\.\d+)? Safari\//.test(navigator.userAgent)) {
        element[request]();
      } else {
        element[request](this.keyboardAllowed ? (Element as any).ALLOW_KEYBOARD_INPUT : {});
      }

      this.on('change', onFullScreenEntered);
    });
  }

  private exit() {
    return new Promise((resolve) => {
      if (!this.isFullscreen) {
        resolve();
        return;
      }

      const onFullScreenExit = () => {
        this.off('change', onFullScreenExit);
        resolve();
      };

      document[this.fn.exitFullscreen]();

      this.on('change', onFullScreenExit);
    });
  }

  private off(event, callback) {
    const eventName = this.eventNameMap[event];
    if (eventName) {
      document.removeEventListener(eventName, callback, false);
    }
  }

  private on(event, callback) {
    const eventName = this.eventNameMap[event];
    if (eventName) {
      document.addEventListener(eventName, callback, false);
    }
  }

  private init() {
    let val;

    const fnMap = [
      [
        'requestFullscreen',
        'exitFullscreen',
        'fullscreenElement',
        'fullscreenEnabled',
        'fullscreenchange',
        'fullscreenerror'
      ],
      // New WebKit
      [
        'webkitRequestFullscreen',
        'webkitExitFullscreen',
        'webkitFullscreenElement',
        'webkitFullscreenEnabled',
        'webkitfullscreenchange',
        'webkitfullscreenerror'

      ],
      // Old WebKit (Safari 5.1)
      [
        'webkitRequestFullScreen',
        'webkitCancelFullScreen',
        'webkitCurrentFullScreenElement',
        'webkitCancelFullScreen',
        'webkitfullscreenchange',
        'webkitfullscreenerror'

      ],
      [
        'mozRequestFullScreen',
        'mozCancelFullScreen',
        'mozFullScreenElement',
        'mozFullScreenEnabled',
        'mozfullscreenchange',
        'mozfullscreenerror'
      ],
      [
        'msRequestFullscreen',
        'msExitFullscreen',
        'msFullscreenElement',
        'msFullscreenEnabled',
        'MSFullscreenChange',
        'MSFullscreenError'
      ]
    ];

    let i = 0;
    const l = fnMap.length;
    const ret = {};

    for (; i < l; i++) {
      val = fnMap[i];
      if (val && val[1] in document) {
        for (i = 0; i < val.length; i++) {
          ret[fnMap[0][i]] = val[i];
        }
        return ret;
      }
    }

    return false;
  }

}
