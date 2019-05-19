s.boot;
s.plotTree;
(
~sourceGroup = Group.new;
~fxGroup = Group.after(~sourceGroup);
~volumeBus = Bus.audio(s, 2);
~reverbBus = Bus.audio(s, 2);
)

(
SynthDef.new(\volumeSynth, {
    arg in, out = 0;
    var sig, amp, pitch;
    sig = In.ar(in, 2);
    amp = Amplitude.kr(sig, 0.1, 8);
//     pitch = Pitch.kr(sig);
    SendReply.kr(Impulse.kr(30), '/amplitudeListener', amp, 1);
    // sig = FreeVerb.ar(sig, 0.5, 0.8, 0.001);
//     sig = sig * 0.9;
//     Out.ar(out, sig);
}).add;
)

(
~volSynth.free;
~volSynth = Synth.new(\volumeSynth, [\in, ~volumeBus, \out, 0], ~fxGroup);
)
(
SynthDef.new(\reverb, {
    arg in, out = 0;
    var sig, del;
    sig = In.ar(in, 2);
    // sig = sig + (GVerb.ar(sig, 200, 10) * 0.1);
    Out.ar(out, sig);
}).add;
)
y = Synth.new(\reverb, [\in, ~reverbBus], ~fxGroup);


(
~mic = {
    var sig, lfo, amp, pitch;
    lfo = SinOsc.ar(15, mul: 0.5, add: 1);
    sig = In.ar(2!2);
    // sig = sig * 25
    // sig = FreeVerb.ar(sig, mix: 0.33, room: 0.9, damp: 0.15);
    // sig = sig * lfo;
//     amp = Amplitude.kr(sig);
//     pitch = Pitch.kr(sig);
//     SendReply.kr(Impulse.kr(10), '/amplitudeListener', amp, 1);
    Out.ar(~volumeBus, sig);
}.play;
)


(
SynthDef.new(\ringzocean, {
    arg out = 0, freq = 220, modFreq = 0.1;
    var sig, mod;
    sig = BrownNoise.ar(0.15!2);
    mod = SinOsc.kr(modFreq, 3pi/2).exprange(0.001, 1);
    sig = sig * mod;
    sig = (sig * 0.2) + Ringz.ar(sig, freq, 0.1, 0.2);
    SendReply.kr(Impulse.kr(10), '/oceanAmp', [mod, freq], 1);
    Out.ar(out, sig);
}).add;
)

p = Synth(\ringzocean, [\out, ~reverbBus, \modFreq, (0.05.linrand + 0.1) * 0.5]);
p.free;

~getRandomModFreq = ({
    (0.05.linrand + 0.1);
});

~getRandomModFreq.value().postln;

(
~listen.free;
~listen = OSCdef(\listener, {|msg|
        var data = msg[3..];
    // var data = msg;
//         data[0].postln;
        ~toOSC.sendMsg("/amplitude", data[0]);
}, '/amplitudeListener');
)



~toOSC = NetAddr.new("127.0.0.1", 57121);    // create the NetAddr
~toOSC.sendMsg("/hello", "there");    // send the application the message "hello" with the parameter "there"