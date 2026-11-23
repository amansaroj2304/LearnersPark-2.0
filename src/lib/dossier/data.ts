/**
 * Content for the 15-day SSB Daily Dossier.
 * Each day: one TAT picture, 15 WAT words, 10 SRT situations, one Lecturette topic.
 * Timings are the platform's practice format (see TIMINGS), configurable later.
 */

export interface DossierDay {
  day: number;
  tat: { image: string; prompt: string };
  wat: string[];
  srt: string[];
  lecturette: string;
}

export const TIMINGS = {
  tatSeconds: 4 * 60 + 30,
  watWordSeconds: 15,
  srtSeconds: 30,
  lecturettePrepSeconds: 3 * 60,
  lecturetteSpeakSeconds: 3 * 60,
} as const;

const LECTURETTE = [
  "The role of youth in nation building",
  "Digital India: opportunities and challenges",
  "Discipline in daily life",
  "Women in the armed forces",
  "Climate change and India's response",
  "The importance of physical fitness",
  "Social media: boon or bane",
  "Start-ups and the Indian economy",
  "Leadership in a crisis",
  "Education for all",
  "India's space programme",
  "Teamwork versus individual brilliance",
  "Water conservation",
  "Border security and national integration",
  "Volunteering and community service",
];

const WAT: string[][] = [
  ["discipline", "fear", "friend", "duty", "failure", "courage", "respect", "anger", "night", "service", "doubt", "effort", "mother", "road", "goal"],
  ["trust", "order", "hurry", "water", "victory", "mistake", "team", "silence", "enemy", "study", "injury", "leader", "habit", "news", "future"],
  ["honesty", "danger", "money", "patience", "exam", "forest", "insult", "help", "decision", "cold", "sister", "result", "crowd", "training", "neighbour"],
  ["responsibility", "tiredness", "village", "brother", "hope", "quarrel", "doctor", "storm", "learning", "police", "surprise", "home", "skill", "sacrifice", "schedule"],
  ["river", "book", "delay", "teacher", "secret", "child", "uniform", "hunger", "rule", "journey", "faith", "speed", "meeting", "apology", "morning"],
  ["ambition", "pain", "school", "strength", "festival", "request", "accident", "uncle", "balance", "report", "bravery", "shop", "advice", "practice", "evening"],
  ["soldier", "family", "risk", "truth", "bus", "loyalty", "confusion", "officer", "energy", "prayer", "field", "suggestion", "calm", "progress", "brotherhood"],
  ["freedom", "sports", "attention", "rejection", "college", "health", "suspicion", "guard", "target", "silence", "friendship", "trouble", "respectful", "believe", "season"],
  ["nation", "duty-bound", "fearless", "opportunity", "border", "sacrifice", "alert", "fitness", "selfless", "command", "loyal", "strategy", "protect", "victory", "patriotic"],
  ["grit", "climb", "mountain", "fog", "rope", "rescue", "map", "signal", "rest", "summit", "camp", "guide", "tired", "path", "weather"],
  ["farm", "crop", "rain", "irrigation", "market", "loan", "harvest", "soil", "seed", "tractor", "cooperative", "price", "storage", "transport", "village council"],
  ["science", "invention", "experiment", "question", "answer", "research", "technology", "machine", "engineer", "design", "repair", "electricity", "solar", "battery", "innovation"],
  ["traffic", "helmet", "signal", "rush", "junction", "accident", "ambulance", "crowd", "patrol", "rules", "speed", "zebra", "footpath", "passenger", "driver"],
  ["flood", "shelter", "boat", "blanket", "food", "medicine", "volunteer", "alert", "family", "rescue", "relief", "donation", "coordination", "warning", "safety"],
  ["interview", "confidence", "silence", "smile", "nervous", "preparation", "question", "answer", "officer", "board", "posture", "voice", "truth", "clarity", "impression"],
];

const SRT: string[][] = [
  [
    "You are cycling home when you see a child run into the road in front of a scooter.",
    "Your roommate has an exam tomorrow and falls ill with high fever at night.",
    "You find a wallet with money and an ID card on the bus seat beside you.",
    "Your team is losing a college match and the captain starts blaming others.",
    "You are asked to speak at a village function with only ten minutes' notice.",
    "You notice your neighbour's house is locked but a window is broken and open.",
    "A friend asks you to help him copy answers during an examination.",
    "You reach the railway station and realise you have lost your ticket.",
    "Your younger sister tells you she is being teased by seniors at school.",
    "The power goes out in your hostel during a practical record submission.",
  ],
  [
    "You are travelling in a bus when a passenger suddenly complains of chest pain.",
    "You are appointed group leader for a trek and two members want to turn back.",
    "You see a group of boys throwing stones at a stray dog in your lane.",
    "Your project partner stops attending college a week before submission.",
    "You are returning late and find the hostel gate locked.",
    "A senior officer asks you a question you do not know the answer to.",
    "Your father's shop is robbed while he is away and you are the only one there.",
    "You are on a train and a co-passenger's bag is stolen at a station halt.",
    "You are asked to organise a blood donation camp in two days.",
    "Your friend tells you he has decided to drop out of college without telling his parents.",
  ],
  [
    "You see smoke coming from a neighbour's kitchen while everyone is away.",
    "You are given an unfamiliar task at work with a deadline the next morning.",
    "A classmate spreads a rumour about you in college.",
    "You are walking home and find an elderly woman who has forgotten her way.",
    "The bus you are driving develops a brake problem on a hill road.",
    "Your team's equipment fails during a competition.",
    "You are asked to mediate between two friends who have stopped talking.",
    "You find that the water supply to your hostel has stopped for two days.",
    "You are offered a shortcut to success that is not honest.",
    "You reach an accident spot before the police and an ambulance.",
  ],
  [
    "You are in charge of a school trip and one student goes missing at a fair.",
    "Your neighbour's crop is damaged by heavy rain a week before harvest.",
    "You are asked to lead a team of people older than you.",
    "You find that a junior has been given the wrong answer key before an exam.",
    "Your bicycle tyre bursts in the middle of a highway at night.",
    "You are told to vacate your rented room within a day.",
    "A close friend asks you for money you know he will not return.",
    "You are invited to a wedding the same day as an important interview.",
    "A snake is found in your school laboratory during class hours.",
    "You see a fight break out in a crowded market.",
  ],
  [
    "Your boat capsizes in a river and two people cannot swim.",
    "You are preparing for an exam and the electricity fails for the whole night.",
    "A teacher humiliates you in front of the class for someone else's mistake.",
    "You find an injured bird in your garden and no vet is available nearby.",
    "You are in a village where the only well has dried up in summer.",
    "Your friend borrows your motorcycle and returns it damaged without telling you.",
    "You are asked to give a speech in a language you speak only a little.",
    "You see a group of children playing dangerously near a railway track.",
    "You are running late for an examination and the auto driver refuses to go faster.",
    "You are the only person who knows about a leak in a hostel water tank.",
  ],
  [
    "You are helping at a village fair when a child's balloon catches fire near a stall.",
    "You are selected for a state-level competition but your parents oppose it.",
    "You reach office and find your laptop with all your work has stopped working.",
    "A stranger on the road asks you to guide him to a hospital urgently.",
    "You are put in charge of decorating the stage an hour before the event.",
    "You are returning from a picnic and the group's vehicle runs out of fuel.",
    "You notice a classmate cheating during a practical exam.",
    "Your friend is depressed after failing an important examination.",
    "You are asked to look after your younger cousins for a full day.",
    "You find a mobile phone ringing in a park with no one around.",
  ],
  [
    "You are on guard duty and notice an unfamiliar person near the boundary wall.",
    "You are leading a squad on a night march and one member sprains his ankle.",
    "You are asked to submit a report on a task you could not complete on time.",
    "You see a colleague being rude to a junior staff member.",
    "You are given a map that does not match the ground during a field exercise.",
    "Your team runs out of drinking water halfway through a long march.",
    "You are asked to take a decision that will disappoint most of your team.",
    "You find an error in a report that has already been submitted to a senior.",
    "A friend in your unit is frequently late and you are his section leader.",
    "You hear a rumour about yourself among your colleagues.",
  ],
  [
    "You are playing a final match and your best player is injured early.",
    "You are asked to coach a group of beginners for a week.",
    "You are given feedback that your work is not good enough.",
    "You are the only one who disagrees with a popular decision in a meeting.",
    "You are asked to choose between two friends for one opportunity.",
    "You lose an important match because of your own mistake.",
    "You are asked to organise a study group but nobody turns up the first day.",
    "Your college team has not won a single game this season.",
    "You are told to change your playing position a day before a match.",
    "You are asked to speak about a failure in front of a large audience.",
  ],
  [
    "You are posted at a remote border post and the radio stops working.",
    "You see a civilian vehicle break down near a restricted area.",
    "You are asked to brief your team in two minutes before an operation.",
    "You find that a colleague has shared confidential information outside.",
    "Your unit is asked to help during a natural disaster in a nearby district.",
    "You are given a task that requires equipment you do not have.",
    "You are asked to lead a team where a senior is also a member.",
    "A local person asks you for help with a problem outside your duty.",
    "You are asked to train a batch of new recruits in half the usual time.",
    "You are stranded with your team in heavy fog on unfamiliar ground.",
  ],
  [
    "You are trekking and the group's food supply is washed away by a stream.",
    "You find the trail marked on your map is blocked by a landslide.",
    "You are climbing and your rope begins to fray near a steep section.",
    "You notice one of your group members is showing signs of altitude sickness.",
    "Your group has to cross a river without a bridge before nightfall.",
    "You are asked to carry a heavier load than the others.",
    "You reach the campsite and find it already occupied by another group.",
    "You see a stranger in difficulty on the trail ahead of you.",
    "You are asked to turn back from near the summit because of weather.",
    "You have to send one member of the group back alone to base camp.",
  ],
  [
    "You are helping your uncle and find his crop has been attacked by pests.",
    "Your village receives rain only after the sowing season is over.",
    "You are asked to help sell produce when the market price suddenly falls.",
    "You find a farmer friend is being charged unfair interest on a loan.",
    "You are asked to explain a new farming technique to older farmers.",
    "You find that a cooperative society's accounts do not match the stock.",
    "Your village road becomes unusable during the rainy season.",
    "You are asked to help transport a harvest before a storm arrives.",
    "You see that the village water channel is blocked by debris.",
    "You are asked to mediate between two farmers quarrelling over a boundary.",
  ],
  [
    "You are asked to repair a water pump with only basic tools available.",
    "You find that a machine you designed fails during its first trial.",
    "You are asked to explain a new technology to a group of villagers.",
    "You discover that a device at home is overheating dangerously.",
    "You are given a week to build a working model for a competition.",
    "You see that the school's solar panel has not worked for a month.",
    "Your project team cannot agree on the best design.",
    "You are asked to reduce the cost of a device without losing quality.",
    "You notice that a public charging point is broken and unsafe.",
    "You are asked to present your idea to experts who question it sharply.",
  ],
  [
    "You are driving and a pedestrian steps onto the road suddenly.",
    "You see a two-wheeler rider without a helmet skidding in front of you.",
    "You are stuck in a traffic jam and an ambulance is behind you.",
    "You find a school bus parked carelessly blocking the road.",
    "You notice a group of students crossing the road at a blind corner.",
    "You see that a road signal has stopped working at a busy junction.",
    "You are asked to manage traffic at a festival for an hour.",
    "Your vehicle is involved in a minor collision with another car.",
    "You find an injured person lying at the side of the road.",
    "You are asked to give a lift to strangers during heavy rain.",
  ],
  [
    "You wake up and find water entering your house after heavy rain.",
    "You are asked to help evacuate an old woman who refuses to leave.",
    "You find that the village shelter has no drinking water for the evacuees.",
    "You see a child separated from his family at a relief camp.",
    "You are asked to distribute relief material fairly to a large crowd.",
    "You notice that one of the boats used for rescue has a leak.",
    "You receive a warning that the river will rise further in two hours.",
    "Your own family is trapped while you are helping others.",
    "You are asked to store and count donated items with limited space.",
    "The phone network fails during the rescue operation.",
  ],
  [
    "You are in an interview and forget the answer to a question you knew well.",
    "You are asked why you failed in an earlier attempt.",
    "You realise you have reached the interview board with a wrong document.",
    "You are asked a question about a topic you have never studied.",
    "You are asked to describe a weakness in front of the board.",
    "You notice your voice shaking during the opening remarks.",
    "You are asked to compare yourself with a candidate who seems better.",
    "You are asked about a decision you regret.",
    "You are asked a question meant to test your honesty.",
    "You are asked to wait outside for two hours before your turn.",
  ],
];

export const DAYS: DossierDay[] = Array.from({ length: 15 }, (_, i) => ({
  day: i + 1,
  tat: {
    image: `/images/dossier/tat/day${String(i + 1).padStart(2, "0")}.jpg`,
    prompt:
      "Look at the picture. Note the characters — their approximate age, sex and mood — and the situation. Then write a story with a clear beginning, a positive main character and a practical outcome.",
  },
  wat: WAT[i],
  srt: SRT[i],
  lecturette: LECTURETTE[i],
}));

export function getDay(day: number): DossierDay | null {
  return DAYS.find((d) => d.day === day) ?? null;
}

export const STATUSES = ["NOT STARTED", "IN PROGRESS", "SUBMITTED", "UNDER REVIEW", "REVIEWED"] as const;
export type DossierStatus = (typeof STATUSES)[number];
