jQuery(function($){
// start
	if($(window).width()>1023) $('body').addClass('open');

// hd
	$('[data-toggle=open]').click(function(){
		var bdy = $('body');
		var snb = $('#snb');
		if(bdy.hasClass('open')){
			bdy.removeClass('open');
			setTimeout(function(){
				snb.hide();
			},500);
		} else {
			snb.show();
			bdy.addClass('open');
		};
	});

// chapter
/*
	$('article.sb_doc>section').each(function(index){
		$(this).attr('id','chapter'+index).append('<span class="num_mark">- '+index+' -</span>')
		.find('>div').each(function(index2){
			$(this).attr('id','chapter'+index+'-'+index2);
		});
	});
*/
// snb
	var snbContent = '';
	$('article.sb_doc>section').each(function(index){
		index = index+1;
		var list2 = '';
		$(this).find('>div').each(function(index2){
			index2 = index2+1;
			list2 = list2+'<li class="nav-item"><a class="nav-link" href="#chapter'+index+'-'+index2+'">'+$(this).find('>h3').html()+'</a></li>';
		});
		var list = '<li class="nav-item"><a class="nav-link" href="#chapter'+index+'">'+$(this).find('>h2').html()+'</a><ul class="nav">'+list2+'</ul></li>';
		snbContent = snbContent+list;
	});
	$('#snb>nav').html('<ol class="nav flex-column chapter_lst">'+snbContent+'</ol>');
	// $('body').scrollspy({target:'#nav'});

// SyntaxHighlighter
window.SyntaxHighlighter.autoloader(
"text plain _guide/syntaxhighlighter/scripts/shBrushPlain.js",
"applescript _guide/syntaxhighlighter/scripts/shBrushAppleScript.js",
"actionscript3 as3 _guide/syntaxhighlighter/scripts/shBrushAS3.js",
"bash shell _guide/syntaxhighlighter/scripts/shBrushBash.js",
"bat cmd batch btm _guide/syntaxhighlighter/scripts/shBrushBatch.js",
"coldfusion cf _guide/syntaxhighlighter/scripts/shBrushColdFusion.js",
"cpp c _guide/syntaxhighlighter/scripts/shBrushCpp.js",
"c# c-sharp csharp _guide/syntaxhighlighter/scripts/shBrushCSharp.js",
"css _guide/syntaxhighlighter/scripts/shBrushCss.js",
"delphi pascal _guide/syntaxhighlighter/scripts/shBrushDelphi.js",
"diff patch pas _guide/syntaxhighlighter/scripts/shBrushDiff.js",
"erl erlang _guide/syntaxhighlighter/scripts/shBrushErlang.js",
"groovy _guide/syntaxhighlighter/scripts/shBrushGroovy.js",
"java _guide/syntaxhighlighter/scripts/shBrushJava.js",
"jfx javafx _guide/syntaxhighlighter/scripts/shBrushJavaFX.js",
"js jscript javascript _guide/syntaxhighlighter/scripts/shBrushJScript.js",
"perl pl _guide/syntaxhighlighter/scripts/shBrushPerl.js",
"php _guide/syntaxhighlighter/scripts/shBrushPhp.js",
"powershell ps _guide/syntaxhighlighter/scripts/shBrushPowerShell.js",
"py python _guide/syntaxhighlighter/scripts/shBrushPython.js",
"ruby rails ror rb _guide/syntaxhighlighter/scripts/shBrushRuby.js",
"sass scss _guide/syntaxhighlighter/scripts/shBrushSass.js",
"scala _guide/syntaxhighlighter/scripts/shBrushScala.js",
"sql _guide/syntaxhighlighter/scripts/shBrushSql.js",
"vb vbnet _guide/syntaxhighlighter/scripts/shBrushVb.js",
"xml xhtml xslt html _guide/syntaxhighlighter/scripts/shBrushXml.js"
);
window.SyntaxHighlighter.config.bloggerMode = true;
window.SyntaxHighlighter.all();
});