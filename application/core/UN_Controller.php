<?php 
/**
 * A base controller that provides clever model 
 * loading, view loading and layout support.
 *
 * @package CodeIgniter
 * @subpackage BM_Controller
 * @license GPLv3 <http://www.gnu.org/licenses/gpl-3.0.txt>
 * @version 0.0.1
 * @author Stefan Jaeger
 * @copyright Copyright (c) 2011, Stefan Jaeger jaeger@reseen.de
 */
require_once (APPPATH . '/core/Template_Controller.php');
 
class UN_Controller extends Template_Controller{

	function __construct() {
        parent::__construct();		
    }
	
	
}
