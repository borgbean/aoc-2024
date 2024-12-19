import readInputToLines from "./util/util.js";

const A_CODE = 'a'.charCodeAt(0);

export default function day19() {
    let input = readInputToLines('inputs/19.txt');

    let available = new Set(input[0].split(', '));

    let trie = {
        chars: new Array(26),
        word: false,
        suffixLink: null
    };
    trie.suffixLink = trie;

    for(let word of available) {
        let node = trie;
        for(let i = 0; i < word.length; ++i) {
            let chr = word.charCodeAt(i)-A_CODE;
            node.chars[chr] ||= {
                chars: new Array(26)
            };
            node = node.chars[chr];
        }
        node.word = true;
        node.text = word;
    }

    let q = [[trie, trie, null]];
    let q2 = [];

    
    while(q.length) {
        let [node, parent, chr] = q.pop();

        node.suffixLink = trie;
        if(node !== trie && parent !== trie) {
            let cur = parent.suffixLink;
            while(true) {
                if(cur.chars[chr]) {
                    node.suffixLink = cur.chars[chr];
                    break;
                }

                if(cur === trie) {
                    break;
                }

                cur = cur.suffixLink;
            }
        }

        for(let chrCode in node.chars) {
            chrCode = Number(chrCode);
            q2.push([node.chars[chrCode], node, chrCode]);
        }
        
        {
            let words = [];
            let wordNode = node;
            while(wordNode !== trie) {
                if(wordNode.word) {
                    words.push(wordNode.text)
                }
                wordNode = wordNode.suffixLink;
            }
            node.words = words;
        }

        if(!q.length) {
            [q, q2] = [q2, q];
        }
    }



    let counts = new Array(100).fill(0);

    let count = 0;
    for(let i = 2; i < input.length; ++i) {
        let str = input[i];

        count += getCount(str);

        // break;
    }

    return count;

    function getCount(str) {
        counts.fill(0);

        let node = trie;
        for(let i = 0; i < str.length; ++i) {
            let chr = str.charCodeAt(i)-A_CODE;

            let possible = true;
            while(true) {
                if(node.chars[chr]) { 
                    node = node.chars[chr];
                    break;
                } else if(node === trie) {
                    possible = false;
                    break;
                }
                node = node.suffixLink;
            }
            if(!possible) {
                return 0;
            }

            if(node.words) {
                for(let word of node.words) {
                    if(word.length >= (i+1)) {
                        ++counts[i];
                    } else {
                        counts[i] += counts[i-word.length];
                    }
                }
            }
        }

        return counts[str.length-1];
    }
}

console.time()
console.log(day19());
console.timeEnd()
