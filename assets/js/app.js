var config = {
    processing: {
        enabled: false,
        interval: null,
    },
    
    generation: {
        url: 'http://oseberganalytics.com/interview/word_generator.php',
        message: 'Please wait for word.', 
    },
    
    transformation: {
        url: 'http://oseberganalytics.com/interview/shifter.php?word=',
        message: 'Please wait for transformation.'
    },
    
    currentWord: null,
    
    el: {
        $generate: null, 
        $word: null,
        $transform: null,
        $error: null
    }
};

$(function() {
    
    config.el.$generate = $('#generate');
    config.el.$word = $('#word');
    config.el.$transform = $('#transform');
    config.el.$error = $('#error-message');
    
    config.el.$generate.click(function(event) {
        event.preventDefault();
        generateWord();
    });
    
    config.el.$transform.click(function(event) {
        event.preventDefault();
        transformWord();
    }); 
    
    config.el.$generate.attr('disabled', null);
});

function generateWord() {
    if (config.processing.enabled) {
        return false;
    }
    startProcessing(false);
    $.get(config.generation.url, function(word) {
        finishProcessing();
        loadWord(word);
    }).error(function() {
        loadingError();
        finishProcessing();
    });
}

function transformWord() {
    if (config.processing.enabled || config.currentWord == null) {
        return false;
    }
    startProcessing(true);
    $.get(config.transformation.url + config.currentWord, function(word) {
        finishProcessing();
        loadWord(word);
    }).error(function() {
        loadingError();
        finishProcessing();
    });
}

function startProcessing(transforming) {
    config.processing.enabled = true;
    config.processing.interval = window.setInterval(function(){showProcessing(transforming);}, 1000);
    config.el.$error.hide();
    config.el.$generate.attr('disabled', 'disabled');
    config.el.$transform.attr('disabled', 'disabled');
    config.el.$word.addClass('processing');
    config.el.$word.val(transforming ? config.transformation.message : config.generation.message);
}

function loadWord(word) {
    config.el.$word.val(word);
    config.currentWord = word;
}

function loadingError(word) {
    config.el.$error.show();
    config.el.$word.val(config.currentWord);
}

function finishProcessing() {
    window.clearInterval(config.processing.interval);
    config.el.$word.removeClass('processing');
    config.el.$generate.attr('disabled', null);
    config.el.$transform.attr('disabled', null);
    config.processing.enabled = false;
}

function showProcessing(transforming) {
    var currentText = config.el.$word.val(),
        newText = null,
        dots = currentText.match(/\./g);
        
    if (dots && dots.length >= 4) {
        newText = transforming ? config.transformation.message : config.generation.message;
    }
    else {
        newText = currentText + '.';
    }
    config.el.$word.val(newText);
}
