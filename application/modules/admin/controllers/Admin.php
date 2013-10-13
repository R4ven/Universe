<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Admin extends MX_Controller {

	public function __construct() {
        $this->load->module('layout');
        parent::__construct();
    }

    public function index () 
    {
    	$this->generateGalaxyView();
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
	
	
	public function generateGalaxyView() {

		$this->load->helper(array('form', 'url'));
		$this->load->library('form_validation');
		$this->load->model('galaxy/galaxygenerator_model');
		
		$this->form_validation->set_rules('galaxy', 'galaxy', 'required');
		$this->form_validation->set_rules('count', 'count', 'required');

		if ($this->form_validation->run() == TRUE)
		{
			$this->galaxygenerator_model->generateGalaxy($this->input->post('galaxy'), $this->input->post('count'));
		}
		
		$this->layout
    		->setBlock('navigation', 'layout/navigation')
			->setBlock('col-main', 'admin/index')
			->render();
	}
	
}

/* End of file welcome.php */
/* Location: ./application/controllers/welcome.php */