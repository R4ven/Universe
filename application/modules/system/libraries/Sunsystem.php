<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Sunsystem
{
	function __construct() {
		$this->CI =& get_instance();
		
	}
	
	/**
	 * @param int $id
	 * @return system/sunsystem_model $sunsystem_model
	 */
	function loadSystem($id) {
		$this->CI->load->model('system/sunsystem_model');
		$this->CI->load->model('system/planet_model');
		
		$query = $this->CI->db->get_where(
								'starsystem', 
								array('sid' => $id), 1)
								->result();
		if(!$query) return false;
		
		$system = $query[0];
		
		$system->planets = array();
		unset($query);
		
		// load Planets
		$query = $this->CI->db->get_where('planet',	array('starSystem_sid' => $id));
		
		foreach ($query->result() as $row)
		{
			$planet = new planet_model();
		    $planet->exchange($row);
			$system->planets[] = $planet;
		}
		
		$sunsystem_model = new sunsystem_model();
		$sunsystem_model->exchange($system);
		
		return $sunsystem_model;
	}
}
