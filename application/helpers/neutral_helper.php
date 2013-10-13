<?php if (!defined('BASEPATH')) exit('No direct script access allowed');


if(!function_exists('css_link')){
    function css_link($file = ''){
        $CI = &get_instance();
        if(isset($CI->project)){
            return base_url().'public/'.$CI->project.'/css/'.$file;
        }
		else{
            return base_url().'public/css/'.$file;
        }
    }
}

if(!function_exists('js_link')){
    function js_link($file = ''){
        $CI = &get_instance();
        if(isset($CI->project)){
            return base_url().'public/'.$CI->project.'/js/'.$file;
        } 
		else{
            return base_url().'public/js/'.$file;
        }
    }
}


if(!function_exists('swf_link')){
	function swf_link($file = ''){
    	$CI = &get_instance();
        if(isset($CI->project)){
            return base_url().'public/'.$CI->project.'/swf/'.$file;
        }
		else{
            return base_url().'public/swf/'.$file;
        }
    }
}

if(!function_exists('image_url')){
    function image_url($file = ''){
        $CI = &get_instance();
        if(isset($CI->project)){
            return base_url().'public/'.$CI->project.'/images/'.$file;
        } 
		else{
            return base_url().'public/images/'.$file;
        }
    }
}
