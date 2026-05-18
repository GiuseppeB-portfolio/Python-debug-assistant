# Python Debug Assistant

> Web app che usa l'API Gemini per analizzare frammenti di codice Python con errori e restituire la versione corretta con spiegazione.

[![status](https://img.shields.io/badge/status-online-success)](#) [![stack](https://img.shields.io/badge/stack-React%20%2B%20TypeScript%20%2B%20Vite-blue)](#) [![ai](https://img.shields.io/badge/ai-Google%20Gemini%20API-orange)](#)

---

## Cosa fa

Incolli del codice Python che dà errore. L'app lo manda a Gemini, che restituisce due cose:

1. La **versione corretta** del codice
2. Una **spiegazione testuale** delle modifiche, con il motivo dell'errore originale

Pensato per i momenti di debugging veloce in cui un IDE non basta: quando vuoi capire *perché* il codice rompe, non solo correggerlo a tentativi.

---

## Perché l'ho costruito

Lavoro come Data Analyst e scrivo Python quasi ogni giorno per pulire e trasformare dati. Capita spesso di incappare in errori — type errors, KeyError su dizionari, problemi di indicizzazione pandas — dove ChatGPT o Copilot vanno benissimo, ma il flusso "apri tab nuova → incolla codice → riformula la domanda" rompe la concentrazione.

Volevo uno strumento mio, sempre aperto, con una sola funzione: codice in input, codice corretto e spiegazione in output. Niente conversazione, niente memoria, niente distrazioni. L'ho costruito in un pomeriggio.

---

## Come è stato costruito (trasparenza)

**Questo progetto è stato sviluppato interamente con Google AI Studio**, lo strumento di Google che permette di generare app funzionanti a partire da prompt in linguaggio naturale. La mia parte è stata:

- Definire il problema da risolvere e il flusso utente desiderato
- Specificare in linguaggio naturale come l'app doveva comportarsi
- Iterare sull'output generato finché non rispondeva al bisogno reale
- Personalizzare l'integrazione con Gemini API per il caso d'uso specifico (debugging Python)
- Verificare il funzionamento e correggere comportamenti non desiderati

**Non sono uno sviluppatore full-stack** e non rivendico di aver scritto il codice React/TypeScript a mano. Ma so identificare un problema che vale la pena automatizzare, formulare una specifica utile, riconoscere quando l'output di un LLM è valido o no, e iterare fino a un risultato funzionante.

Nel 2026 questa è una skill professionale a sé stante, distinta dallo sviluppo software tradizionale: usare strumenti AI per produrre soluzioni concrete a problemi reali, senza dover essere un programmatore professionista per farlo. È esattamente l'approccio che applico anche nel mio lavoro di analisi dati, dove integro Copilot, Gemini e altri assistenti nel mio workflow quotidiano.

---

## Stack tecnico

| Componente | Tecnologia |
|---|---|
| Frontend | React + TypeScript |
| Build tool | Vite |
| API LLM | Google Gemini |
| Generato con | Google AI Studio |
| Deploy | Vercel |

---

## Come provarlo

**Online:** apri il link al live demo sopra.

**In locale:**

```bash
# 1. Clona il repo
git clone https://github.com/GiuseppeB-portfolio/Python-debug-assistant.git
cd Python-debug-assistant

# 2. Installa le dipendenze
npm install

# 3. Crea il file .env.local nella root con la tua chiave Gemini
echo "GEMINI_API_KEY=la_tua_chiave_qui" > .env.local

# 4. Avvia in development
npm run dev
```

Per ottenere una chiave Gemini gratuita: [aistudio.google.com/apikey](https://aistudio.google.com/apikey)

---

## Limiti

Lo strumento è pensato per **frammenti di codice brevi** (singole funzioni, snippet di analisi dati, errori isolati). Per debugging di progetti complessi o errori che dipendono dal contesto dell'intera codebase, un IDE con linter e un assistente conversazionale come Cursor o Copilot sono più adatti.

L'app non esegue il codice — analizza solo staticamente quello che ricevi. Non è quindi affidabile al 100% per errori runtime che dipendono da dati specifici o stato dell'applicazione.

---

## Cosa dimostra questo progetto

Sul piano professionale, questo side project documenta tre cose:

- La capacità di **identificare un problema reale del proprio workflow** e progettare una soluzione mirata
- La **fluency con strumenti AI** per produrre output funzionanti senza essere uno sviluppatore di mestiere
- L'**onestà nel raccontare il processo** — incluso il riconoscere quali parti del lavoro sono state delegate all'AI e quali sono state mie

---

*Side project realizzato nel tempo libero come esperimento di AI-augmented building. Parte del [portfolio di Giuseppe Bianco](https://github.com/GiuseppeB-portfolio), Data Analyst.*
