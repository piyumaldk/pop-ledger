# PoPLedger

## Overview
PoPLedger: https://pop-ledger.web.app

PoPLedger is a TypeScript based application designed to track the progress of video games and TV series in a clean ledger style format.

## Getting Started

### Prerequisites
- Node.js version 14 or higher
- npm Node Package Manager

### Installation and Usage
1. Clone the repository
   ```
   git clone https://github.com/yourusername/space-pop-ledger.git
   ```
2. Navigate to the project directory
   ```
   cd space-pop-ledger
   ```
3. Install the dependencies
   ```
   npm ci
   ```
4. Start the development server
   ```
   npm run dev
   ```

5. Build the project
   ```
   npm run build
   ```

6. Deploy the project
   ```
   npm run deploy
   ```


## Contributing
Contributions are welcome via Pull Requests.

You can contribute by adding a simple TXT file using the format below.

### File Rules
- File name must be the game or series name
- Use lowercase letters only
- No spaces or symbols

### File Structure
- Title must start with `#` and a space followed by the name
- Subtitles are plain text lines
- Checklist items must start with `-` and a space
- Location:
   - resources/games for games
   - resources/series for TV series

### Examples
1. https://github.com/piyumaldk/pop-ledger/blob/main/resources/games/alanwake2.txt
2. https://github.com/piyumaldk/pop-ledger/blob/main/resources/games/callofdutyblackops6.txt
3. https://github.com/piyumaldk/pop-ledger/blob/main/resources/series/attackontitan.txt

Once reviewed, the contribution will be merged and automatically deployed.

## License
This project is licensed under the MIT License. See the LICENSE file for details.
