(
Event.addEventType(\playPiano, {
    var no = ~num;
    topEnvironment.use({~piano.(no);});
})
)

(
~pianoA.stop;
    ~pianoA = Pbind(
        \type, \playPiano,
        \dur, Pseq([4, 2, 2], inf),
    \num, 45
    ).play(t, quant: 4);
)