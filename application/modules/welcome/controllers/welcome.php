<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Welcome extends MX_Controller {

	public function __construct() {
        $this->load->module('layout');
        parent::__construct();
    }

    public function index () 
    {
    	$this->layout
    		->setBlock('navigation', 'layout/navigation')
			->setBlock('col-main', 'welcome/index')
			->render();
        //$this->layout->load()->render();
    }
}

/* End of file welcome.php */
/* Location: ./application/controllers/welcome.php */