export const TRANSLATIONS = {
  fi: {
    // Header & App
    appName: "Mölkkis",
    appSubtitle: "Mölkky-säännöt & pistelaskuri",
    
    // Setup Screen
    playersTitle: "Pelaajat",
    addPlayer: "Lisää pelaaja",
    randomizeOrder: "Arvo heittojärjestys",
    startGame: "Aloita peli",
    turnOrderHint: "Järjestä heittojärjestys raahaamalla pelaajia.",
    playerPlaceholder: "Pelaaja {num}",
    removePlayer: "Poista pelaaja",
    minPlayersAlert: "Lisää vähintään kaksi pelaajaa peliin!",
    duplicateNamesAlert: "Anna kaikille pelaajille eri nimet!",
    colorPickerTitle: "Pelaajan väri",
    colorPickerSubtitle: "Valitse pelaajalle väri:",
    
    // Install Card
    appAvailableTitle: "Mölkkis sovellus!",
    appAvailableText: "Mökillä huonolla nettillä? Asenna Mölkkis sovelluksena offline-käyttöön.",
    installAppBtn: "Asenna sovellus",
    
    // Mölkky Setup / Rules Card
    molkkySetupTitle: "Mölkky-keilojen asettelu",
    molkkySetupNote: "Mölkyn virallinen heittomatka on 3.5 metriä.",
    
    // Rules Section
    rulesTitle: "Mölkky-säännöt & pistelasku",
    rule1Title: "Asettelu & heitto:",
    rule1Text: "Aseta keilat 1–12 ryhmään 3,5 metrin päähän heittoviivasta. Mölkky-pikka heitetään aina alakautta.",
    rule2Title: "Pisteiden lasku:",
    rule2Item1: "1 kaadettu keila: saat keilan osoittaman pistemäärän (1–12 pistettä).",
    rule2Item2: "Useampi kaadettu keila (2+): saat pisteitä kaadettujen keilojen lukumäärän verran (esim. 4 keilaa = 4 pistettä).",
    rule3Title: "50 pistettä voittoon:",
    rule3Text: "Ensimmäisenä tasan 50 pistettä saavuttanut pelaaja voittaa pelin!",
    rule4Title: "Ylimenorangaistus (>50 p):",
    rule4Text: "Jos pistemäärä ylittää 50, pistemäärä tippuu takaisin 25 pisteeseen.",
    rule5Title: "3 hutia - pudotus:",
    rule5Text: "Jos heität 3 kertaa peräkkäin huti (0 keilaa), putoat pelistä.",
    
    // Footer
    builtWithLove: "Mölkky-pistelaskuri mökille ja pihapeleihin",

    // Game Screen Top Status Bar
    pointsToWin: "50 pistettä voittoon",
    turnIndicator: "Vuorossa: {name}",
    editingTurnIndicator: "Muokataan tulosta: {name}",
    exitGameBtn: "Lopeta peli",

    // Scoreboard
    roundHeader: "#",
    totalHeader: "Yht.",
    totalLabel: "Yht.",
    eliminated: "Pudotettu",
    eliminatedBadge: "3 huti - pudotettu!",
    
    // Keypad
    missBtn: "Huti (0)",
    undoBtn: "Peruta",
    
    // End Game Confirmation Modal
    endGameConfirmTitle: "Lopetetaanko peli?",
    endGameConfirmMessage: "Oletko varma, että haluat lopettaa pelin kesken?",

    // Results / Winner Modal
    gameOverTitle: "Peli päättyi!",
    winnerAnnounce: "Voittaja on {name}!",
    rankingsTitle: "Lopputulokset",
    rankPlace: "{place}. sija",
    newGameBtn: "Uusi peli",
    closeBtn: "Sulje",

    // Settings Modal
    settingsTitle: "Sovelluksen asetukset",
    themeSectionTitle: "Väriteema",
    themeSectionSubtitle: "Valitse haluamasi teema:",
    dataSectionTitle: "Tiedot & muisti",
    dataSectionSubtitle: "Tyhjennä tallennetut pelit ja asetukset:",
    clearDataBtn: "Tyhjennä muisti & välimuisti",
    doneBtn: "Valmis",
    activeThemeBadge: "✓ Käytössä",

    // Themes
    themeDefault: "Oletus (Klassikko sininen)",
    themeDefaultDesc: "Tumma laivastonsininen ja kirkas sininen (#3877d3)",
    themeForest: "Metsä (Vihreä)",
    themeForestDesc: "Männynvihreä, merenvihreä ja oljenkeltainen",
    themeKawai: "Kawai (Roosa & Pastelli)",
    themeKawaiDesc: "Pastelliroosa, vaaleanpunainen ja laventeli",
    themeBlackout: "Musta (Red Accent)",
    themeBlackoutDesc: "Syvänmusta, harmaa ja kirkkaanpunainen",
    themeFire: "Liekki (Oranssi & Kelta)",
    themeFireDesc: "Hehkuva oranssi, meripihka ja tulipunainen",

    // Clear Storage Modal
    clearConfirmTitle: "Tyhjennä muisti & välimuisti",
    clearConfirmMessage: "Tämä poistaa kaikki tallennetut pelit ja asetukset. Haluatko varmasti jatkaa?",
    cancelBtn: "Peruuta",
    confirmYesBtn: "Kyllä, tyhjennä",

    // Language Modal
    languageModalTitle: "Valitse kieli / Select Language",
    languageModalSubtitle: "Valitse sovelluksen kieli:",
    langFi: "Suomi",
    langEn: "English",
    langSv: "Svenska"
  },

  en: {
    // Header & App
    appName: "Mölkkis",
    appSubtitle: "Mölkky Scorekeeper & Point Calculator",
    
    // Setup Screen
    playersTitle: "Players",
    addPlayer: "Add player",
    randomizeOrder: "Randomize order",
    startGame: "Start game",
    turnOrderHint: "Drag players to rearrange turn order.",
    playerPlaceholder: "Player {num}",
    removePlayer: "Remove player",
    minPlayersAlert: "Please add at least two players!",
    duplicateNamesAlert: "Please give every player a unique name!",
    
    // Install Card
    appAvailableTitle: "App Available!",
    appAvailableText: "Bad connection at the cottage? Install Mölkkis for offline play.",
    installAppBtn: "Install App",
    
    // Mölkky Setup / Rules Card
    molkkySetupTitle: "Mölkky Pin Setup",
    molkkySetupNote: "Official Mölkky throwing distance is 3.5 meters (11.5 feet).",
    
    // Rules Section
    rulesTitle: "Mölkky Rules & Scoring",
    rule1Title: "Setup & Throw:",
    rule1Text: "Place pins 1–12 in a cluster 3.5 meters from the throwing line. Throw the Mölkky wooden pin underhand.",
    rule2Title: "Scoring Points:",
    rule2Item1: "1 pin knocked down: Score the number printed on that pin (1–12 points).",
    rule2Item2: "Multiple pins (2+): Score the total count of fallen pins (e.g. 4 pins = 4 points).",
    rule3Title: "50 Points to Win:",
    rule3Text: "The first player to reach exactly 50 points wins the game!",
    rule4Title: "Bust Penalty (>50 pts):",
    rule4Text: "If your total score exceeds 50, your score drops back down to 25 points.",
    rule5Title: "3 Misses Elimination:",
    rule5Text: "Missing all pins 3 times in a row results in elimination from the game.",
    
    // Footer
    builtWithLove: "Mölkky scorekeeper for outdoor games",

    // Game Screen Top Status Bar
    pointsToWin: "50 points to win",
    turnIndicator: "{name}'s Turn",
    editingTurnIndicator: "Editing turn: {name}",
    exitGameBtn: "Exit game",

    // Scoreboard
    roundHeader: "#",
    totalHeader: "Total",
    totalLabel: "Total",
    eliminated: "Eliminated",
    eliminatedBadge: "3 misses - eliminated!",
    
    // Keypad
    missBtn: "Miss (0)",
    undoBtn: "Undo",
    
    // End Game Confirmation Modal
    endGameConfirmTitle: "End Game?",
    endGameConfirmMessage: "Are you sure you want to end the game early?",

    // Results / Winner Modal
    gameOverTitle: "Game Over!",
    winnerAnnounce: "{name} wins!",
    rankingsTitle: "Final Standings",
    rankPlace: "{place}. Place",
    newGameBtn: "New Game",
    closeBtn: "Close",

    // Settings Modal
    settingsTitle: "Application Settings",
    themeSectionTitle: "Color Theme",
    themeSectionSubtitle: "Select your preferred color scheme:",
    dataSectionTitle: "Data & Storage",
    dataSectionSubtitle: "Clear saved games and cached memory:",
    clearDataBtn: "Clear Storage & Cache",
    doneBtn: "Done",
    activeThemeBadge: "✓ Active",

    // Themes
    themeDefault: "Default (Legacy Blue)",
    themeDefaultDesc: "Midnight Slate with Vibrant Blue (#3877d3)",
    themeForest: "Forest Green",
    themeForestDesc: "Pine Teal, Sea Green & Dry Sage",
    themeKawai: "Kawai (Pastel Pink)",
    themeKawaiDesc: "Pastel Pink, Rose & Lavender",
    themeBlackout: "Blackout (Crimson)",
    themeBlackoutDesc: "Pitch Black, Gray & Crimson",
    themeFire: "Fire (Blazing Orange)",
    themeFireDesc: "Blazing Orange, Amber & Flame Red",

    // Clear Storage Modal
    clearConfirmTitle: "Clear Storage & Cache",
    clearConfirmMessage: "This deletes all games and settings: are you sure you want to proceed?",
    cancelBtn: "Cancel",
    confirmYesBtn: "Yes, clear data",

    // Language Modal
    languageModalTitle: "Select Language",
    languageModalSubtitle: "Choose your preferred application language:",
    langFi: "Suomi",
    langEn: "English",
    langSv: "Svenska"
  },

  sv: {
    // Header & App
    appName: "Mölkkis",
    appSubtitle: "Mölkky poängräknare & protokoll",
    
    // Setup Screen
    playersTitle: "Spelare",
    addPlayer: "Lägg till spelare",
    randomizeOrder: "Slumpa ordning",
    startGame: "Starta spel",
    turnOrderHint: "Dra spelare för att ändra turordningen.",
    playerPlaceholder: "Spelare {num}",
    removePlayer: "Ta bort spelare",
    minPlayersAlert: "Lägg till minst två spelare!",
    duplicateNamesAlert: "Ge alla spelare unika namn!",
    
    // Install Card
    appAvailableTitle: "App tillgänglig!",
    appAvailableText: "Dålig täckning vid stugan? Installera Mölkkis för offline-användning.",
    installAppBtn: "Installera App",
    
    // Mölkky Setup / Rules Card
    molkkySetupTitle: "Mölkky uppställning",
    molkkySetupNote: "Officiellt Mölkky kastavstånd är 3,5 meter",
    
    // Rules Section
    rulesTitle: "Mölkky Regler & Poängsättning",
    rule1Title: "Uppställning & Kast:",
    rule1Text: "Placera käglorna 1–12 i en klunga 3,5 meter från kastlinjen. Kasta mölkkyn underhandskast.",
    rule2Title: "Poängräkning:",
    rule2Item1: "1 fälld kägla: Få poängen som står på käglan (1–12 poäng).",
    rule2Item2: "Flera fällda käglor (2+): Få poäng motsvarande antalet fällda käglor (t.ex. 4 käglor = 4 poäng).",
    rule3Title: "50 Poäng för att vinna:",
    rule3Text: "Den första spelaren som når exakt 50 poäng vinner spelet!",
    rule4Title: "Överstigning (>50 p):",
    rule4Text: "Om din totala poäng överstiger 50 faller den tillbaka till 25 poäng.",
    rule5Title: "3 Missar utslagning:",
    rule5Text: "Om du missar alla käglor 3 gånger i rad åker du ut ur spelet.",
    
    // Footer
    builtWithLove: "Mölkky poängräknare för stugan och trädgården",

    // Game Screen Top Status Bar
    pointsToWin: "50 poäng för vinst",
    turnIndicator: "{name}s tur",
    editingTurnIndicator: "Redigerar poäng: {name}",
    exitGameBtn: "Avsluta spel",

    // Scoreboard
    roundHeader: "#",
    totalHeader: "Totalt",
    totalLabel: "Totalt",
    eliminated: "Utslagen",
    eliminatedBadge: "3 missar - utslagen!",
    
    // Keypad
    missBtn: "Miss (0)",
    undoBtn: "Ångra",
    
    // End Game Confirmation Modal
    endGameConfirmTitle: "Avsluta spelet?",
    endGameConfirmMessage: "Är du säker på att du vill avsluta spelet i förtid?",

    // Results / Winner Modal
    gameOverTitle: "Spelet slut!",
    winnerAnnounce: "{name} vinner!",
    rankingsTitle: "Slutresultat",
    rankPlace: "{place}. plats",
    newGameBtn: "Nytt spel",
    closeBtn: "Stäng",

    // Settings Modal
    settingsTitle: "Applikationsinställningar",
    themeSectionTitle: "Färgtema",
    themeSectionSubtitle: "Välj ditt färgtema:",
    dataSectionTitle: "Data & lagring",
    dataSectionSubtitle: "Rensa sparade spel och minne:",
    clearDataBtn: "Rensa data & minne",
    doneBtn: "Klar",
    activeThemeBadge: "✓ Aktiv",

    // Themes
    themeDefault: "Standard (Klassisk Blå)",
    themeDefaultDesc: "Mörkblå med klargrön/blå accent (#3877d3)",
    themeForest: "Skogsgrön",
    themeForestDesc: "Tallgrön, havsgrön och halmgul",
    themeKawai: "Kawai (Pastellrosa)",
    themeKawaiDesc: "Pastellrosa, rosa och lavendel",
    themeBlackout: "Svart (Röd accent)",
    themeBlackoutDesc: "Kolsvart, grå och knallröd",
    themeFire: "Eld (Flammande orange)",
    themeFireDesc: "Flammande orange, bärnsten och eldröd",

    // Clear Storage Modal
    clearConfirmTitle: "Rensa data & minne",
    clearConfirmMessage: "Detta raderar alla sparade spel och inställningar. Vill du fortsätta?",
    cancelBtn: "Avbryt",
    confirmYesBtn: "Ja, rensa",

    // Language Modal
    languageModalTitle: "Välj språk",
    languageModalSubtitle: "Välj språk för applikationen:",
    langFi: "Suomi",
    langEn: "English",
    langSv: "Svenska"
  }
};

export function getTranslation(lang, key, params = {}) {
  const dictionary = TRANSLATIONS[lang] || TRANSLATIONS.fi;
  let template = dictionary[key] || TRANSLATIONS.fi[key] || key;

  Object.keys(params).forEach((param) => {
    template = template.replace(new RegExp(`\\{${param}\\}`, "g"), params[param]);
  });

  return template;
}
