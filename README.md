# Esan AI

**Teaching AI to understand and speak Esan, in its own dialects, tones and voice.**

> 🤝 **We're looking for collaborators!** Esan speakers from any dialect, linguists, teachers, engineers, and anyone with Esan recordings or texts. See [How you can help](#how-you-can-help) or email **[osereme@arreba.net](mailto:osereme@arreba.net)**.

Esan (ISO 639-3: `ish`) is an Edoid language spoken in Edo State, Nigeria. It is tonal, and it varies from town to town: Uromi, Ekpoma, Irrua, Ubiaja, Ugboha, Ewohimi, Igueben, Ewatto and more. Almost no AI tools exist for it today. This project aims to change that, built with Esan speakers and owned by the community.

## Goals

1. **Preserve.** Build an open, well-documented archive of spoken and written Esan: words, sentences and stories, tagged by dialect and speaker. Every speaker gives consent.
2. **Understand.** Speech recognition that turns spoken Esan into text, for each dialect.
3. **Speak.** Text-to-speech that sounds native, with correct high/low tones, downstep and the melody of each dialect, not a flat "foreign" voice.
4. **Translate.** English ↔ Esan translation, with the option to choose a dialect.
5. **Teach.** An Esan tutor and voice assistant built on verified data, which says "I'm not sure" instead of inventing words.

## Principles

- **Tone is not optional.** Esan written or spoken without tone loses its meaning. All data carries tone marks (á high, à low, ꜜ downstep), checked against real pitch.
- **Every dialect counts.** Each recording is tagged with its dialect, and the models learn dialects separately rather than averaging them into one.
- **Speakers own their voices.** Informed consent, fair pay, the right to withdraw, and clear licences.
- **Native speakers have the final word.** Models never "correct" a speaker.

## Status: just starting

- [x] Project plan and architecture
- [x] Prototype tools: Esan spelling normaliser, syllable and tone tiers, pronunciation (IPA) converter, dialect registry
- [x] First word list (~70 words and phrases) sent out for recording
- [ ] First recordings from native speakers
- [ ] Pilot dialect dataset
- [ ] First speech-recognition and voice models

## Next steps

1. **Permissions.** Get permission to train on existing Esan data and lessons (the Hieber/Akhigbe archive, the "Esan Language For All" lessons).
2. **Spelling convention.** Agree a tone-marking convention with Esan linguists (e.g. Ambrose Alli University, Ekpoma).
3. **Pilot recordings.** 4 speakers (2 women, 2 men) from one dialect, about 10 hours of clearly read sentences, each with tone-marked text and an English translation.
4. **Word list.** Grow it to 3,000 verified words, each with dialect variants.
5. **First models.** Train the first speech-recognition model, then the first Esan voice. Native speakers score them.

## How you can help

We're actively looking for collaborators. You don't need to be an AI expert. If you speak, teach, study or love Esan, there's a place for you.

- **Speak Esan?** Record words and sentences in your dialect.
- **Linguist or teacher?** Help check spellings, tones and grammar.
- **Engineer?** Help with data tooling and model training.
- **Have Esan books, recordings or radio archives?** Tell us about them.

**To get involved, [open an issue](../../issues/new)** saying who you are, your dialect (if you speak Esan) and how you'd like to help.

## Contact

**Christian Ekoh**, project lead: [osereme@arreba.net](mailto:osereme@arreba.net)

---
*Status: planning stage. Code and data will be added here as they are ready and cleared for release.*
