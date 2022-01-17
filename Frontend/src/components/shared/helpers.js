const WORDSET = ["be", "and", "of", "a", "in", "to", "have", "too", "it", "I", "that", "for", "you", "he", "with", "on", "do", "say", "this", "they", "at", "but", "we", "his", "from", "that", "not", "can", "won", "by", "she", "or", "as", "what", "go", "their", "can", "who", "get", "if", "would", "her", "all", "my", "make", "about", "know", "will", "as", "up", "one", "time", "there", "year", "so", "think", "when", "which", "them", "some", "me", "people", "take", "out", "into", "just", "see", "him", "your", "come", "could", "now", "than", "like", "other", "how", "then", "its", "our", "two", "more", "these", "want", "way", "look", "first", "also", "new", "because", "day", "more", "use", "no", "man", "find", "here", "thing", "give", "many", "well", "only", "those", "tell", "one", "very", "her", "even", "back", "any", "good", "woman", "through", "us", "life", "child", "there", "work", "down", "may", "after", "should", "call", "world", "over", "school", "still", "try", "in", "as", "last", "ask", "need", "too", "feel", "three", "when", "state", "never", "become", "between", "high", "really", "something", "most", "another", "much", "family", "own", "out", "leave", "put", "old", "while", "mean", "on", "keep", "student", "why", "let", "great", "same", "big", "group", "begin", "seem", "country", "help", "talk", "where", "turn", "problem", "every", "start", "hand", "might", "American", "show", "part", "about", "against", "place", "over", "such", "again", "few", "case", "most", "week", "company", "where", "system", "each", "right", "program", "hear", "so", "question", "during", "work", "play", "government", "run", "small", "number", "off", "always", "move", "like", "night", "live", "Mr", "point", "believe", "hold", "today", "bring", "happen", "next", "without", "before", "large", "all", "million", "must", "home", "under", "water", "room", "write", "mother", "area", "national", "money", "story", "young", "fact", "month", "different", "lot", "right", "study", "book", "eye", "job", "word", "though", "business", "issue", "side", "kind", "four", "head", "far", "black", "long", "both", "little", "house", "yes", "after", "since", "long", "provide", "service", "around", "friend", "important", "father", "sit", "away", "until", "power", "hour", "game", "often", "yet", "line", "political", "end", "among", "ever", "stand", "bad", "lose", "however", "member", "pay", "law", "meet", "car", "city", "almost", "include", "continue", "set", "later", "community", "much", "name", "five", "once", "white", "least", "president", "learn", "real", "change", "team", "minute", "best", "several", "idea", "kid", "body", "information", "nothing", "ago", "right", "lead", "social", "understand", "whether", "back", "watch", "together", "follow", "around", "parent", "only", "stop", "face", "anything", "create", "public", "already", "speak", "others", "read", "level", "allow", "add", "office", "spend", "door", "health", "person", "art", "sure", "such", "war", "history", "party", "within", "grow", "result", "open", "change", "morning", "walk", "reason", "low", "win", "research", "girl", "guy", "early", "food", "before", "moment", "himself", "air", "teacher", "force", "offer", "enough", "both", "education", "across", "although", "remember", "foot", "second", "boy", "maybe", "toward", "able", "age", "off", "policy", "everything", "love", "process", "music", "including", "consider", "appear", "actually", "buy", "probably", "human", "wait", "serve", "market", "die", "send", "expect", "home", "sense", "build", "stay", "fall", "oh", "nation", "plan", "cut", "college", "interest", "death", "course", "someone", "experience", "behind", "reach", "local", "kill", "six", "remain", "effect", "use", "yeah", "suggest", "class", "control", "raise", "care", "perhaps", "little", "late", "hard", "field", "else", "pass", "former", "sell", "major", "sometimes", "require", "along", "development", "themselves", "report", "role", "better", "economic", "effort", "up", "decide", "rate", "strong", "possible", "heart", "drug", "show", "leader", "light", "voice", "wife", "whole", "police", "mind", "finally", "pull", "return", "free", "military", "price", "report", "less", "according", "decision", "explain", "son", "hope", "even", "develop", "view", "relationship", "carry", "town", "road", "drive", "arm", "true", "federal", "break", "better", "difference", "thank", "receive", "value", "international", "building", "action", "full", "model", "join", "season", "society", "because", "tax", "director", "early", "position", "player", "agree", "especially", "record", "pick", "wear", "paper", "special", "space", "ground", "form", "support", "event", "official", "whose", "matter", "everyone", "center", "couple", "site", "end", "project", "hit", "base", "activity", "star", "table", "need", "court", "produce", "eat", "American", "teach", "oil", "half", "situation", "easy", "cost", "industry", "figure", "face", "street", "image", "itself", "phone", "either", "data", "cover", "quite", "picture", "clear", "practice", "piece", "land", "recent", "describe", "product", "doctor", "wall", "patient", "worker", "news", "test", "movie", "certain", "north", "love", "personal", "open", "support", "simply", "third", "technology", "catch", "step", "baby", "computer", "type", "attention", "draw", "film", "Republican", "tree", "source", "red", "nearly", "organization", "choose", "cause", "hair", "look", "point", "century", "evidence", "window", "difficult", "listen", "soon", "culture", "billion", "chance", "brother", "energy", "period", "course", "summer", "less", "realize", "hundred", "available", "plant", "likely", "opportunity", "term", "short", "letter", "condition", "choice", "place", "single", "rule", "daughter", "administration", "south", "husband", "Congress", "floor", "campaign", "material", "population", "well", "call", "economy", "medical", "hospital", "church", "close", "thousand", "risk", "current", "fire", "future", "wrong", "involve", "defense", "anyone", "increase", "security", "bank", "myself", "certainly", "west", "sport", "board", "seek", "per", "subject", "officer", "private", "rest", "behavior", "deal", "performance", "fight", "throw", "top", "quickly", "past", "goal", "second", "bed", "order", "author", "fill", "represent", "focus", "foreign", "drop", "plan", "blood", "upon", "agency", "push", "nature", "color", "no", "recently", "store", "reduce", "sound", "note", "fine", "before", "near", "movement", "page", "enter", "share", "than", "common", "poor", "other", "natural", "race", "concern", "series", "significant", "similar", "hot", "language", "each", "usually", "response", "dead", "rise", "animal", "factor", "decade", "article", "shoot", "east", "save", "seven", "artist", "away", "scene", "stock", "career", "despite", "central", "eight", "thus", "treatment", "beyond", "happy", "exactly", "protect", "approach", "lie", "size", "dog", "fund", "serious", "occur", "media", "ready", "sign", "thought", "list", "individual", "simple", "quality", "pressure", "accept", "answer", "hard", "resource", "identify", "left", "meeting", "determine", "prepare", "disease", "whatever", "success", "argue", "cup", "particularly", "amount", "ability", "staff", "recognize", "indicate", "character", "growth", "loss", "degree", "wonder", "attack", "herself", "region", "television", "box", "TV", "training", "pretty", "trade", "deal", "election", "everybody", "physical", "lay", "general", "feeling", "standard", "bill", "message", "fail", "outside", "arrive", "analysis", "benefit", "name", "sex", "forward", "lawyer", "present", "section", "environmental", "glass", "answer", "skill", "sister", "PM", "professor", "operation", "financial", "crime", "stage", "ok", "compare", "authority", "miss", "design", "sort", "one", "act", "ten", "knowledge", "gun", "station", "blue", "state", "strategy", "little", "clearly", "discuss", "indeed", "force", "truth", "song", "example", "democratic", "check", "environment", "leg", "dark", "public", "various", "rather", "laugh", "guess", "executive", "set", "study", "prove", "hang", "entire", "rock", "design", "enough", "forget", "since", "claim", "note", "remove", "manager", "help", "close", "sound", "enjoy", "network", "legal", "religious", "cold", "form", "final", "main", "science", "green", "memory", "card", "above", "seat", "cell", "establish", "nice", "trial", "expert", "that", "spring", "firm", "Democrat", "radio", "visit", "management", "care", "avoid", "imagine", "tonight", "huge", "ball", "no", "close", "finish", "yourself", "talk", "theory", "impact", "respond", "statement", "maintain", "charge", "popular", "traditional", "onto", "reveal", "direction", "weapon", "employee", "cultural", "contain", "peace", "head", "control", "base", "pain", "apply", "play", "measure", "wide", "shake", "fly", "interview", "manage", "chair", "fish", "particular", "camera", "structure", "politics", "perform", "bit", "weight", "suddenly", "discover", "candidate", "top", "production", "treat", "trip", "evening", "affect", "inside", "conference", "unit", "best", "style", "adult", "worry", "range", "mention", "rather", "far", "deep", "past", "edge", "individual", "specific", "writer", "trouble", "necessary", "throughout", "challenge", "fear", "shoulder", "institution", "middle", "sea", "dream", "bar", "beautiful", "property", "instead", "improve", "stuff", "claim"]
const WORDSET_INDEXES = {}
    // const WORDS_DIVIDED_BY_LENGTH = {}

    // WORDSET.forEach(word => {
    //   if (!WORDS_DIVIDED_BY_LENGTH[word.length])
    //     WORDS_DIVIDED_BY_LENGTH[word.length] = []
    
    //   WORDS_DIVIDED_BY_LENGTH[word.length].push(word)
    // })

const commonPuncs = [`,`, `.`]
const puncs = [`""`, `''`, `?`, `!`, `:`, `;`]
const puncsThatEndSentence = [`.`, `!`, `?`]

export function randomEndingPunc() {
    return getRandomFrom(puncsThatEndSentence)
}

export function wordHasEndingPunc(word) {
    return word && Array.from(word).reduce((result, letter) => {
        if (puncsThatEndSentence.includes(letter))
            return true
        else
            return result
    }, false)
}

const repeat = num => fn => { for (let i = 0; i < num; i++) fn(i) }

export function getRandomFrom(array) {
    return array
        ? array[Math.floor(Math.random() * array.length)]
        : undefined
}

export function formatWordSet({ words, withSpace, withCaps, withPunc }) {
    words = words.map(word => (
        word.replace(/[\W_]+/g,"")
        ))
        
    let capNextWord = true
    words = words.map((word, i) => {
        if (capNextWord) word = word.charAt(0).toUpperCase() + word.slice(1)
        capNextWord = false

        const rand = Math.random()
        switch (true) {
            case rand > 0.7:
                break
            case rand > 0.15:
                if (withPunc) {
                    const puncSet = rand > 0.25 ? commonPuncs : puncs
                    const punc = getRandomFrom(puncSet)
                    if (punc.length === 1) {
                        word = word + punc
                    } else if(punc.length === 2) {
                        word = punc[0] + word + punc[1]
                    }
                    capNextWord = (puncsThatEndSentence.includes(punc))
                } else if (rand > 0.35){
                    word = word.charAt(0).toUpperCase() + word.slice(1) 
                }
                break
        }
        if (withSpace) word = word + ' '
       
        return word
    })

    words = words.map(word => {
        if (!withCaps) word = word.toLowerCase()
        if (!withPunc) word = word.replace(/[\W_][ ]+/g,"")
        return word
    })

    return words
}

export function getRandomWords({ num, withSpace, withCaps, withPunc }) {
    num = num ?? 1
    let words = []
    for (let index = 0; index < num; index++) {
        let word = getRandomFrom(WORDSET)
        words.push(word)
    }

    words = formatWordSet({ words, withSpace, withCaps, withPunc})
    return words
}

export function addWordsToArr(arr, num) {
    let result = [...arr]
    for (let index = 0; index < num; index++) {
        result.push(getRandomWords() + ' ')
    }
    return result
}

function isFirstLetterCapital(string) {
    return string.charAt(0) === string.charAt(0).toUpperCase();
}

function initializeWordsetIndexes() {
    WORDSET.forEach((word, i) => {
        WORDSET_INDEXES[word.toLocaleLowerCase()] = i 
    })
}

function isLetter(letter) {
    return letter.match(/[A-Z|a-z]/i) === null ? false : true
}

// transform a set of words to shorter codes of the index of the word in the wordset,
// punctuation, capitalization
export function wordsetToCodes(wordRows) {
    // if word indexes haven't been initialized
    if (Object.entries(WORDSET_INDEXES).length === 0)
        initializeWordsetIndexes()

    return wordRows.map(wordRow => wordRow.map(word => wordToCode(word)))
}

function wordToCode(word) {
    let result = ''
    // if last character is space, slice it
    if (word.slice(-1) === ' ') word = word.slice(0, -1)

    const firstIsCap = isFirstLetterCapital(word)
    if (firstIsCap) {
        word = word.toLowerCase()
    }

    let lastCharacter = word.slice(-1)
    const lastIsLet = isLetter(lastCharacter)
    // is last char is not letter (punctuation), separate it from the word
    if (!lastIsLet) {
        word = word.slice(0, -1)
    }
    
    // push index of the word
    result += WORDSET_INDEXES[word] 
    if (!lastIsLet) result += ' ' + lastCharacter
    if (firstIsCap) result += ' ' + 'c'
    return result
}

function codeToWord(code) {
    const codes = code.split(' ')
    let word = WORDSET[codes[0]]

    if (codes[1] !== undefined) {
        if (codes[1] === 'c') {
            word = word[0].toUpperCase() + word.slice(1)
        } else {
            word += codes[1]
        }
    }
    
    if (codes[2] === 'c') {
        word = word[0].toUpperCase() + word.slice(1)
    }

    // add space to the end
    word += ' '

    return word 
}

export function wordCodesToWords(codes) {
    return codes.map(row => (
        row.map(code => codeToWord(code))
    ))
}

export const windowIsScrollable = () => (window.innerHeight + window.scrollY) <= document.body.offsetHeight

