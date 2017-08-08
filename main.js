(()=>{
  const identity = function(e) {
    /* console.log(e);
     * ctx.suspend();*/
    return e;
  }
  let process = identity;

  const textArea = document.querySelector('textarea');
  const runButton = document.querySelector('button');
  const songInput = document.querySelector('input#fileSelector'); 
  const audioElement = document.querySelector('audio#input');

  const ctx = new AudioContext();
  const src = ctx.createMediaElementSource(audioElement);
  const spn = ctx.createScriptProcessor(1024, 1, 1);

  let lastBuffer = [];
  spn.onaudioprocess = e => {
    let outputBuffer = e.outputBuffer.getChannelData(0);
    lastBuffer = outputBuffer.slice()
    let renderedBuffer = process.call(null, e.inputBuffer.getChannelData(0), lastBuffer) || [];
    for (var i = 0; i < outputBuffer.length; i++) {
      outputBuffer[i] = renderedBuffer[i] || 0;
    }
  }

  src.connect(spn);
  spn.connect(ctx.destination);

  runButton.addEventListener('click', () => {
    try {
      const f = new Function('inputBuffer', textArea.value);
      f([]);
      process = f;
    } catch (e) {
      alert(e);
    }
  });

  songInput.addEventListener('change', e => {
    audioElement.src = window.URL.createObjectURL(e.target.files[0]);
  });
})();
