
const completer = {
    getCompletions: (_editor, _session, _pos, prefix, callback) => {
        const allInstructions = ['mov', 'add', 'cmp', 'beq'];
        
        const allConstants = Array.from(Array(0xFFFF+1).keys()).map(i => i.toString(16).toUpperCase());
        const allCompletions = [...new Set([...allInstructions, ...allConstants])];
        const completions = allCompletions.filter(c => c.startsWith(prefix));

        callback(null, completions.map(c => {
            return {
                caption: c,
                value: c,
                meta: "assembly"
            };
        }));

        return true;
    }
};

export default completer;