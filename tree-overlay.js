(() => {
   const root = new URL('.', document.currentScript.src);
   function setup() {
      const back = Array.from(document.querySelectorAll('nav a, p a')).find(link => /^(Home|Up one level|back|back to intro)$/i.test(link.textContent.trim()));
      if (!back || document.querySelector('[data-gallery-tree]')) return;
      const link = document.createElement('a');
      link.dataset.galleryTree = '';
      link.textContent = 'tree view';
      const tree = new URL('tree.html', root);
      tree.searchParams.set('current', location.pathname.slice(root.pathname.length));
      link.href = tree.href;
      const text = back.nextSibling;
      if (text?.nodeType === Node.TEXT_NODE && text.textContent.startsWith(')')) {
         const remainder = text.splitText(1);
         remainder.before(document.createTextNode(' ('), link, document.createTextNode(')'));
      } else {
         back.parentElement.append(document.createTextNode(' ('), link, document.createTextNode(')'));
      }
      link.addEventListener('click', event => {
         if (event.button || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
         event.preventDefault();
         const dialog = document.createElement('dialog');
         dialog.setAttribute('aria-label', 'Gallery tree view');
         dialog.style.cssText = 'padding:0;border:1px solid #777;border-radius:8px;width:min(850px,94vw);max-width:94vw;height:90dvh;max-height:94dvh;background:#fff;color:#222;overflow:hidden;';
         const frame = document.createElement('iframe');
         frame.title = 'Gallery navigation tree';
         frame.style.cssText = 'display:block;border:0;width:100%;height:100%;';
         const source = new URL(tree);
         source.searchParams.set('overlay', '1');
         frame.src = source.href;
         dialog.append(frame);
         document.body.append(dialog);
         const previousOverflow = document.documentElement.style.overflow;
         const close = () => dialog.close();
         const receive = message => {
            if (message.source === frame.contentWindow && message.origin === root.origin && message.data === 'close-gallery-tree') close();
         };
         window.addEventListener('message', receive);
         dialog.addEventListener('close', () => {
            window.removeEventListener('message', receive);
            document.documentElement.style.overflow = previousOverflow;
            dialog.remove();
            link.focus({ preventScroll: true });
         }, { once: true });
         dialog.showModal();
         document.documentElement.style.overflow = 'hidden';
         frame.focus();
      });
   }
   if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setup, { once: true });
   else setup();
})();
