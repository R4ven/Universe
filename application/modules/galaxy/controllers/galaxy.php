<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Galaxy extends MX_Controller {

	public function __construct() {
        $this->load->module('layout');
        parent::__construct();
    }

    public function index () 
    {
    	$this->layout
    		->addJs(JS_FILE_THREEJS)
    		->setBlock('navigation', 'layout/navigation')
			->setBlock('col-main', 'galaxy/index')
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
	public function json($gid) {
		$gid = mysql_real_escape_string($gid);
		
		$this->load->library('galaxy/galaxyrepository');
		
		$systems = $this->galaxyrepository->loadById($gid);
		
		$arr = array();
		foreach($systems AS $key => $system) $arr[] = $system->getJson();
		
		echo json_encode($arr);
	}
}

/* End of file welcome.php */
/* Location: ./application/controllers/welcome.php */