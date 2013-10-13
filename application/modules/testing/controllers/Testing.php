<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Testing extends MX_Controller {

	public function __construct() {
        $this->load->module('layout');
        parent::__construct();
    }

    public function index () 
    {
    	$this->layout
			->setBlock('col-main', 'testing/index')
			->render();
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
	
	
}

/* End of file welcome.php */
/* Location: ./application/controllers/welcome.php */