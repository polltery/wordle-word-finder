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
            //
            // Example query: D*??R*
            // Returns: /^(?=.*[D])(?=.*[R])(?=[^D]..[^R].).....$/
            //
            var queryRegex = "";
            var includeLetters = "";
            var mustContainLetterRegex = "(?=.*$)";
            var includeLetterPositions = "";
            for (var i = 0; i < this.query.length; i++) {
                var letter = this.query[i];
                if(letter === "?"){
                    queryRegex += ".";
                    includeLetterPositions += "."
                }else{
                    if(i+1 <= this.query.length && this.query[i+1] === "*"){
                        includeLetters += mustContainLetterRegex.replace("$", letter.toLowerCase());
                        includeLetterPositions += "[^" + letter.toLowerCase() + "]"
                        queryRegex += ".";
                        i += 1;
                    }else{
                        includeLetterPositions += ".";
                        queryRegex += letter.toLowerCase();
                    }
                }
            }
            var excludeRegex = this.excludeLetters.length > 0 ? "(?!.*[" + this.excludeLetters.toLowerCase() + "])" : "";     
            var includeRegex = includeLetters.length > 0 ? includeLetters : "";
            var includeLetterPositionRegex = includeLetters.length > 0 ? "(?=" + includeLetterPositions + ")" : "";
            return new RegExp("^" + excludeRegex + includeRegex + includeLetterPositionRegex + queryRegex + "$");
        }
    }
})

// bind Enter key to searchBtn
var input = document.getElementById("query");
input.addEventListener("keyup", function(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    document.getElementById("searchBtn").click();
  }
}); 