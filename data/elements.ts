export type ElementCategory =
    | 'Alkali Metal'
    | 'Alkaline Earth Metal'
    | 'Transition Metal'
    | 'Post-Transition Metal'
    | 'Metalloid'
    | 'Non-Metal'
    | 'Halogen'
    | 'Noble Gas'
    | 'Lanthanide'
    | 'Actinide';

export interface Element {
    number: number;
    symbol: string;
    name: string;
    mass: number;
    category: ElementCategory;
    row: number;
    col: number;
}

const getPos = (row: number, col: number) => ({ row, col });

export const elements: Element[] = [
    // Period 1
    { number: 1, symbol: 'H', name: 'Hydrogen', mass: 1.008, category: 'Non-Metal', ...getPos(1, 1) },
    { number: 2, symbol: 'He', name: 'Helium', mass: 4.0026, category: 'Noble Gas', ...getPos(1, 18) },

    // Period 2
    { number: 3, symbol: 'Li', name: 'Lithium', mass: 6.94, category: 'Alkali Metal', ...getPos(2, 1) },
    { number: 4, symbol: 'Be', name: 'Beryllium', mass: 9.0122, category: 'Alkaline Earth Metal', ...getPos(2, 2) },
    { number: 5, symbol: 'B', name: 'Boron', mass: 10.81, category: 'Metalloid', ...getPos(2, 13) },
    { number: 6, symbol: 'C', name: 'Carbon', mass: 12.011, category: 'Non-Metal', ...getPos(2, 14) },
    { number: 7, symbol: 'N', name: 'Nitrogen', mass: 14.007, category: 'Non-Metal', ...getPos(2, 15) },
    { number: 8, symbol: 'O', name: 'Oxygen', mass: 15.999, category: 'Non-Metal', ...getPos(2, 16) },
    { number: 9, symbol: 'F', name: 'Fluorine', mass: 18.998, category: 'Halogen', ...getPos(2, 17) },
    { number: 10, symbol: 'Ne', name: 'Neon', mass: 20.180, category: 'Noble Gas', ...getPos(2, 18) },

    // Period 3
    { number: 11, symbol: 'Na', name: 'Sodium', mass: 22.990, category: 'Alkali Metal', ...getPos(3, 1) },
    { number: 12, symbol: 'Mg', name: 'Magnesium', mass: 24.305, category: 'Alkaline Earth Metal', ...getPos(3, 2) },
    { number: 13, symbol: 'Al', name: 'Aluminium', mass: 26.982, category: 'Post-Transition Metal', ...getPos(3, 13) },
    { number: 14, symbol: 'Si', name: 'Silicon', mass: 28.085, category: 'Metalloid', ...getPos(3, 14) },
    { number: 15, symbol: 'P', name: 'Phosphorus', mass: 30.974, category: 'Non-Metal', ...getPos(3, 15) },
    { number: 16, symbol: 'S', name: 'Sulfur', mass: 32.06, category: 'Non-Metal', ...getPos(3, 16) },
    { number: 17, symbol: 'Cl', name: 'Chlorine', mass: 35.45, category: 'Halogen', ...getPos(3, 17) },
    { number: 18, symbol: 'Ar', name: 'Argon', mass: 39.948, category: 'Noble Gas', ...getPos(3, 18) },

    // Period 4
    { number: 19, symbol: 'K', name: 'Potassium', mass: 39.098, category: 'Alkali Metal', ...getPos(4, 1) },
    { number: 20, symbol: 'Ca', name: 'Calcium', mass: 40.078, category: 'Alkaline Earth Metal', ...getPos(4, 2) },
    { number: 21, symbol: 'Sc', name: 'Scandium', mass: 44.956, category: 'Transition Metal', ...getPos(4, 3) },
    { number: 22, symbol: 'Ti', name: 'Titanium', mass: 47.867, category: 'Transition Metal', ...getPos(4, 4) },
    { number: 23, symbol: 'V', name: 'Vanadium', mass: 50.942, category: 'Transition Metal', ...getPos(4, 5) },
    { number: 24, symbol: 'Cr', name: 'Chromium', mass: 51.996, category: 'Transition Metal', ...getPos(4, 6) },
    { number: 25, symbol: 'Mn', name: 'Manganese', mass: 54.938, category: 'Transition Metal', ...getPos(4, 7) },
    { number: 26, symbol: 'Fe', name: 'Iron', mass: 55.845, category: 'Transition Metal', ...getPos(4, 8) },
    { number: 27, symbol: 'Co', name: 'Cobalt', mass: 58.933, category: 'Transition Metal', ...getPos(4, 9) },
    { number: 28, symbol: 'Ni', name: 'Nickel', mass: 58.693, category: 'Transition Metal', ...getPos(4, 10) },
    { number: 29, symbol: 'Cu', name: 'Copper', mass: 63.546, category: 'Transition Metal', ...getPos(4, 11) },
    { number: 30, symbol: 'Zn', name: 'Zinc', mass: 65.38, category: 'Transition Metal', ...getPos(4, 12) },
    { number: 31, symbol: 'Ga', name: 'Gallium', mass: 69.723, category: 'Post-Transition Metal', ...getPos(4, 13) },
    { number: 32, symbol: 'Ge', name: 'Germanium', mass: 72.630, category: 'Metalloid', ...getPos(4, 14) },
    { number: 33, symbol: 'As', name: 'Arsenic', mass: 74.922, category: 'Metalloid', ...getPos(4, 15) },
    { number: 34, symbol: 'Se', name: 'Selenium', mass: 78.971, category: 'Non-Metal', ...getPos(4, 16) },
    { number: 35, symbol: 'Br', name: 'Bromine', mass: 79.904, category: 'Halogen', ...getPos(4, 17) },
    { number: 36, symbol: 'Kr', name: 'Krypton', mass: 83.798, category: 'Noble Gas', ...getPos(4, 18) },

    // Period 5
    { number: 37, symbol: 'Rb', name: 'Rubidium', mass: 85.468, category: 'Alkali Metal', ...getPos(5, 1) },
    { number: 38, symbol: 'Sr', name: 'Strontium', mass: 87.62, category: 'Alkaline Earth Metal', ...getPos(5, 2) },
    { number: 39, symbol: 'Y', name: 'Yttrium', mass: 88.906, category: 'Transition Metal', ...getPos(5, 3) },
    { number: 40, symbol: 'Zr', name: 'Zirconium', mass: 91.224, category: 'Transition Metal', ...getPos(5, 4) },
    { number: 41, symbol: 'Nb', name: 'Niobium', mass: 92.906, category: 'Transition Metal', ...getPos(5, 5) },
    { number: 42, symbol: 'Mo', name: 'Molybdenum', mass: 95.95, category: 'Transition Metal', ...getPos(5, 6) },
    { number: 43, symbol: 'Tc', name: 'Technetium', mass: 98, category: 'Transition Metal', ...getPos(5, 7) },
    { number: 44, symbol: 'Ru', name: 'Ruthenium', mass: 101.07, category: 'Transition Metal', ...getPos(5, 8) },
    { number: 45, symbol: 'Rh', name: 'Rhodium', mass: 102.91, category: 'Transition Metal', ...getPos(5, 9) },
    { number: 46, symbol: 'Pd', name: 'Palladium', mass: 106.42, category: 'Transition Metal', ...getPos(5, 10) },
    { number: 47, symbol: 'Ag', name: 'Silver', mass: 107.87, category: 'Transition Metal', ...getPos(5, 11) },
    { number: 48, symbol: 'Cd', name: 'Cadmium', mass: 112.41, category: 'Transition Metal', ...getPos(5, 12) },
    { number: 49, symbol: 'In', name: 'Indium', mass: 114.82, category: 'Post-Transition Metal', ...getPos(5, 13) },
    { number: 50, symbol: 'Sn', name: 'Tin', mass: 118.71, category: 'Post-Transition Metal', ...getPos(5, 14) },
    { number: 51, symbol: 'Sb', name: 'Antimony', mass: 121.76, category: 'Metalloid', ...getPos(5, 15) },
    { number: 52, symbol: 'Te', name: 'Tellurium', mass: 127.60, category: 'Metalloid', ...getPos(5, 16) },
    { number: 53, symbol: 'I', name: 'Iodine', mass: 126.90, category: 'Halogen', ...getPos(5, 17) },
    { number: 54, symbol: 'Xe', name: 'Xenon', mass: 131.29, category: 'Noble Gas', ...getPos(5, 18) },

    // Period 6
    { number: 55, symbol: 'Cs', name: 'Caesium', mass: 132.91, category: 'Alkali Metal', ...getPos(6, 1) },
    { number: 56, symbol: 'Ba', name: 'Barium', mass: 137.33, category: 'Alkaline Earth Metal', ...getPos(6, 2) },
    { number: 57, symbol: 'La', name: 'Lanthanum', mass: 138.91, category: 'Lanthanide', ...getPos(6, 3) }, // Often placed here, or in f-block
    { number: 58, symbol: 'Ce', name: 'Cerium', mass: 140.12, category: 'Lanthanide', ...getPos(9, 3) },
    { number: 59, symbol: 'Pr', name: 'Praseodymium', mass: 140.91, category: 'Lanthanide', ...getPos(9, 4) },
    { number: 60, symbol: 'Nd', name: 'Neodymium', mass: 144.24, category: 'Lanthanide', ...getPos(9, 5) },
    { number: 61, symbol: 'Pm', name: 'Promethium', mass: 145, category: 'Lanthanide', ...getPos(9, 6) },
    { number: 62, symbol: 'Sm', name: 'Samarium', mass: 150.36, category: 'Lanthanide', ...getPos(9, 7) },
    { number: 63, symbol: 'Eu', name: 'Europium', mass: 151.96, category: 'Lanthanide', ...getPos(9, 8) },
    { number: 64, symbol: 'Gd', name: 'Gadolinium', mass: 157.25, category: 'Lanthanide', ...getPos(9, 9) },
    { number: 65, symbol: 'Tb', name: 'Terbium', mass: 158.93, category: 'Lanthanide', ...getPos(9, 10) },
    { number: 66, symbol: 'Dy', name: 'Dysprosium', mass: 162.50, category: 'Lanthanide', ...getPos(9, 11) },
    { number: 67, symbol: 'Ho', name: 'Holmium', mass: 164.93, category: 'Lanthanide', ...getPos(9, 12) },
    { number: 68, symbol: 'Er', name: 'Erbium', mass: 167.26, category: 'Lanthanide', ...getPos(9, 13) },
    { number: 69, symbol: 'Tm', name: 'Thulium', mass: 168.93, category: 'Lanthanide', ...getPos(9, 14) },
    { number: 70, symbol: 'Yb', name: 'Ytterbium', mass: 173.05, category: 'Lanthanide', ...getPos(9, 15) },
    { number: 71, symbol: 'Lu', name: 'Lutetium', mass: 174.97, category: 'Lanthanide', ...getPos(9, 16) },
    { number: 72, symbol: 'Hf', name: 'Hafnium', mass: 178.49, category: 'Transition Metal', ...getPos(6, 4) },
    { number: 73, symbol: 'Ta', name: 'Tantalum', mass: 180.95, category: 'Transition Metal', ...getPos(6, 5) },
    { number: 74, symbol: 'W', name: 'Tungsten', mass: 183.84, category: 'Transition Metal', ...getPos(6, 6) },
    { number: 75, symbol: 'Re', name: 'Rhenium', mass: 186.21, category: 'Transition Metal', ...getPos(6, 7) },
    { number: 76, symbol: 'Os', name: 'Osmium', mass: 190.23, category: 'Transition Metal', ...getPos(6, 8) },
    { number: 77, symbol: 'Ir', name: 'Iridium', mass: 192.22, category: 'Transition Metal', ...getPos(6, 9) },
    { number: 78, symbol: 'Pt', name: 'Platinum', mass: 195.08, category: 'Transition Metal', ...getPos(6, 10) },
    { number: 79, symbol: 'Au', name: 'Gold', mass: 196.97, category: 'Transition Metal', ...getPos(6, 11) },
    { number: 80, symbol: 'Hg', name: 'Mercury', mass: 200.59, category: 'Transition Metal', ...getPos(6, 12) },
    { number: 81, symbol: 'Tl', name: 'Thallium', mass: 204.38, category: 'Post-Transition Metal', ...getPos(6, 13) },
    { number: 82, symbol: 'Pb', name: 'Lead', mass: 207.2, category: 'Post-Transition Metal', ...getPos(6, 14) },
    { number: 83, symbol: 'Bi', name: 'Bismuth', mass: 208.98, category: 'Post-Transition Metal', ...getPos(6, 15) },
    { number: 84, symbol: 'Po', name: 'Polonium', mass: 209, category: 'Metalloid', ...getPos(6, 16) },
    { number: 85, symbol: 'At', name: 'Astatine', mass: 210, category: 'Halogen', ...getPos(6, 17) },
    { number: 86, symbol: 'Rn', name: 'Radon', mass: 222, category: 'Noble Gas', ...getPos(6, 18) },

    // Period 7
    { number: 87, symbol: 'Fr', name: 'Francium', mass: 223, category: 'Alkali Metal', ...getPos(7, 1) },
    { number: 88, symbol: 'Ra', name: 'Radium', mass: 226, category: 'Alkaline Earth Metal', ...getPos(7, 2) },
    { number: 89, symbol: 'Ac', name: 'Actinium', mass: 227, category: 'Actinide', ...getPos(7, 3) },
    { number: 90, symbol: 'Th', name: 'Thorium', mass: 232.04, category: 'Actinide', ...getPos(10, 3) },
    { number: 91, symbol: 'Pa', name: 'Protactinium', mass: 231.04, category: 'Actinide', ...getPos(10, 4) },
    { number: 92, symbol: 'U', name: 'Uranium', mass: 238.03, category: 'Actinide', ...getPos(10, 5) },
    { number: 93, symbol: 'Np', name: 'Neptunium', mass: 237, category: 'Actinide', ...getPos(10, 6) },
    { number: 94, symbol: 'Pu', name: 'Plutonium', mass: 244, category: 'Actinide', ...getPos(10, 7) },
    { number: 95, symbol: 'Am', name: 'Americium', mass: 243, category: 'Actinide', ...getPos(10, 8) },
    { number: 96, symbol: 'Cm', name: 'Curium', mass: 247, category: 'Actinide', ...getPos(10, 9) },
    { number: 97, symbol: 'Bk', name: 'Berkelium', mass: 247, category: 'Actinide', ...getPos(10, 10) },
    { number: 98, symbol: 'Cf', name: 'Californium', mass: 251, category: 'Actinide', ...getPos(10, 11) },
    { number: 99, symbol: 'Es', name: 'Einsteinium', mass: 252, category: 'Actinide', ...getPos(10, 12) },
    { number: 100, symbol: 'Fm', name: 'Fermium', mass: 257, category: 'Actinide', ...getPos(10, 13) },
    { number: 101, symbol: 'Md', name: 'Mendelevium', mass: 258, category: 'Actinide', ...getPos(10, 14) },
    { number: 102, symbol: 'No', name: 'Nobelium', mass: 259, category: 'Actinide', ...getPos(10, 15) },
    { number: 103, symbol: 'Lr', name: 'Lawrencium', mass: 262, category: 'Actinide', ...getPos(10, 16) },
    { number: 104, symbol: 'Rf', name: 'Rutherfordium', mass: 267, category: 'Transition Metal', ...getPos(7, 4) },
    { number: 105, symbol: 'Db', name: 'Dubnium', mass: 270, category: 'Transition Metal', ...getPos(7, 5) },
    { number: 106, symbol: 'Sg', name: 'Seaborgium', mass: 271, category: 'Transition Metal', ...getPos(7, 6) },
    { number: 107, symbol: 'Bh', name: 'Bohrium', mass: 274, category: 'Transition Metal', ...getPos(7, 7) },
    { number: 108, symbol: 'Hs', name: 'Hassium', mass: 277, category: 'Transition Metal', ...getPos(7, 8) },
    { number: 109, symbol: 'Mt', name: 'Meitnerium', mass: 278, category: 'Transition Metal', ...getPos(7, 9) },
    { number: 110, symbol: 'Ds', name: 'Darmstadtium', mass: 281, category: 'Transition Metal', ...getPos(7, 10) },
    { number: 111, symbol: 'Rg', name: 'Roentgenium', mass: 282, category: 'Transition Metal', ...getPos(7, 11) },
    { number: 112, symbol: 'Cn', name: 'Copernicium', mass: 285, category: 'Transition Metal', ...getPos(7, 12) },
    { number: 113, symbol: 'Nh', name: 'Nihonium', mass: 286, category: 'Post-Transition Metal', ...getPos(7, 13) },
    { number: 114, symbol: 'Fl', name: 'Flerovium', mass: 289, category: 'Post-Transition Metal', ...getPos(7, 14) },
    { number: 115, symbol: 'Mc', name: 'Moscovium', mass: 290, category: 'Post-Transition Metal', ...getPos(7, 15) },
    { number: 116, symbol: 'Lv', name: 'Livermorium', mass: 293, category: 'Post-Transition Metal', ...getPos(7, 16) },
    { number: 117, symbol: 'Ts', name: 'Tennessine', mass: 294, category: 'Halogen', ...getPos(7, 17) },
    { number: 118, symbol: 'Og', name: 'Oganesson', mass: 294, category: 'Noble Gas', ...getPos(7, 18) },
];

export const elementMap = new Map(elements.map(e => [e.symbol, e]));