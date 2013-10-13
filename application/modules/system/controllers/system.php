<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class System extends MX_Controller {

	public function __construct() {
        $this->load->module('layout');
        parent::__construct();
    }

    public function index ($systemid)
    {
		$data = array();
		$data['systemid'] = $systemid;
		
    	$this->layout
    		->addJs(JS_FILE_THREEJS)
			//->addJS('public/js/lib/THREEx.WindowResize.js')
    		->setBlock('navigation', 'layout/navigation')
			->setBlock('col-main', 'system/index', $data)
			->render();
		
        //$this->layout->load()->render();
    }
	
	public function _remap($method, $params = array())
	{
	    if (method_exists($this, $method))
	    {
	        return call_user_func_array(array($this, $method), $params);
	    } elseif(is_numeric($method)) {
	    	return $this->index((int)$method);
	    }
	    show_404();
	}
	/**
	 * @param int $uid
	 */
	public function json($systemid) {
		$systemid = mysql_real_escape_string($systemid);
		
		$this->load->library('system/sunsystem');
		
		$system = $this->sunsystem->loadSystem($systemid);
		
		echo json_encode($system->getJson());
	}
}

/* End of file welcome.php */
/* Location: ./application/controllers/welcome.php */