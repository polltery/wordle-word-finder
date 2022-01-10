var app = new Vue({
    el: '#app',
    data: {
        possibleWords: words,
        query: "?????",
        excludeLetters: "",
        result: "Results will appear here",
        displayedMatches: [],
        displayLength: 1000
    },
    methods:{
        search: function(event){
            this.result = "Validating...";
            if(this.validateQuery()){
                this.result = "Searching...";
                var matches = []
                var queryRegex = this.buildQueryRegex();
                for(i = 0; i < this.possibleWords.length; i++){
                    var possibleWord = this.possibleWords[i];
                    if(queryRegex.test(possibleWord.toLowerCase())){
                        matches.push(possibleWord);
                        if(this.displayedMatches.length < this.displayLength){
                            this.displayedMatches.push(possibleWord.toUpperCase())
                        }
                    }
                }
                if(matches.length > 0){
                    this.result = "" + matches.length + " words matched, showing only " + this.displayLength + ".";
                }else{
                    this.result = "No match.";
                }
            }else{
                this.result = "Invalid search query.";
            }
        },
        validateQuery: function(){
            var validationRegex = new RegExp(/^([a-z]\*?|\?){5}$/);
            var validationRegexForExcludedLetters = new RegExp(/^[a-z]{0,19}$/);
            this.displayedMatches = []
            if(validationRegex.test(this.query.toLowerCase())
                && validationRegexForExcludedLetters.test(this.excludeLetters.toLowerCase())){
               return true;
            }
            return false;
        },
        buildQueryRegex: function(){
            var queryRegex = "";
            var includeLetters = "";
            for (var i = 0; i < this.query.length; i++) {
                var letter = this.query[i];
                if(letter === "?"){
                    queryRegex += ".";
                }else{
                    if(i+1 <= this.query.length && this.query[i+1] === "*"){
                        includeLetters += letter.toLowerCase();
                        queryRegex += ".";
                        i += 1;
                    }else{
                        queryRegex += letter.toLowerCase();
                    }
                }
            }
            var excludeRegex = this.excludeLetters.length > 0 ? "(?!.*[" + this.excludeLetters.toLowerCase() + "])" : "";     
            var includeRegex = includeLetters.length > 0 ? "(?=.*[" + includeLetters.toLowerCase() + "])" : "";
            return new RegExp("^" + excludeRegex + includeRegex + queryRegex + "$");
        }
    }
})