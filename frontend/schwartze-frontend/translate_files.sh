#!/bin/bash

# Find all tekst.txt files in the en/ directory
find en/ -name "tekst.txt" | while read -r file; do
    dir=$(dirname "$file")
    output_file="$dir/text.txt"

    echo "Translating $file to $output_file"

    # Read the content of the file
    content=$(cat "$file")

    # Translate common Dutch phrases and words to English
    # This is a simplified translation approach - in a real scenario, you might use a translation API
    translated=$(echo "$content" |
        sed 's/Lieve/Dear/g' |
        sed 's/Liefste/Dearest/g' |
        sed 's/Beste/Best/g' |
        sed 's/Waarde/Valued/g' |
        sed 's/Geachte/Respected/g' |
        sed 's/Hallo/Hello/g' |
        sed 's/Dag/Day/g' |
        sed 's/Groeten/Greetings/g' |
        sed 's/Hartelijke groeten/Warm regards/g' |
        sed 's/Met vriendelijke groet/With kind regards/g' |
        sed 's/Tot ziens/See you soon/g' |
        sed 's/Bedankt/Thank you/g' |
        sed 's/Dank je/Thank you/g' |
        sed 's/Dank u/Thank you/g' |
        sed 's/alsjeblieft/please/g' |
        sed 's/Alsjeblieft/Please/g' |
        sed 's/Woensdagmiddag/Wednesday afternoon/g' |
        sed 's/Donderdagmiddag/Thursday afternoon/g' |
        sed 's/Vrijdagmiddag/Friday afternoon/g' |
        sed 's/Zaterdagmiddag/Saturday afternoon/g' |
        sed 's/Zondagmiddag/Sunday afternoon/g' |
        sed 's/Maandagmiddag/Monday afternoon/g' |
        sed 's/Dinsdagmiddag/Tuesday afternoon/g' |
        sed 's/Woensdag/Wednesday/g' |
        sed 's/Donderdag/Thursday/g' |
        sed 's/Vrijdag/Friday/g' |
        sed 's/Zaterdag/Saturday/g' |
        sed 's/Zondag/Sunday/g' |
        sed 's/Maandag/Monday/g' |
        sed 's/Dinsdag/Tuesday/g' |
        sed 's/Januari/January/g' |
        sed 's/Februari/February/g' |
        sed 's/Maart/March/g' |
        sed 's/April/April/g' |
        sed 's/Mei/May/g' |
        sed 's/Juni/June/g' |
        sed 's/Juli/July/g' |
        sed 's/Augustus/August/g' |
        sed 's/September/September/g' |
        sed 's/Oktober/October/g' |
        sed 's/November/November/g' |
        sed 's/December/December/g' |
        sed 's/en/and/g' |
        sed 's/of/or/g' |
        sed 's/het/the/g' |
        sed 's/de/the/g' |
        sed 's/een/a/g' |
        sed 's/is/is/g' |
        sed 's/zijn/are/g' |
        sed 's/hebben/have/g' |
        sed 's/krijgen/get/g' |
        sed 's/gaan/go/g' |
        sed 's/komen/come/g' |
        sed 's/zien/see/g' |
        sed 's/horen/hear/g' |
        sed 's/voelen/feel/g' |
        sed 's/denken/think/g' |
        sed 's/weten/know/g' |
        sed 's/kunnen/can/g' |
        sed 's/willen/want/g' |
        sed 's/moeten/must/g' |
        sed 's/mogen/may/g' |
        sed 's/zullen/will/g' |
        sed 's/overdwars/sideways/g' |
        sed 's/op de kop/upside down/g' |
        sed 's/gedraaid/turned/g' |
        sed 's/kwartslag/quarter/g')

    # Write the translated content to the output file
    echo "$translated" > "$output_file"
done

echo "Translation completed!"
