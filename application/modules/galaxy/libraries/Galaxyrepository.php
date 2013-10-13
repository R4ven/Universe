<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Galaxyrepository
{
	function __construct() {
		$this->CI =& get_instance();
	}
	
	/**
	 * @param int $id
	 * @return system/sunsystem_model $sunsystem_model
	 */
	
	function loadById($id) {
		$this->CI->load->model('galaxy/star_model');
		
		$arr = array();

		$query = $this->CI->db->get_where(
								'starsystem', 
								array('pid' => $id)
								);
								
		if(!$query) return $arr;

		foreach ($query->result() as $row)
		{
			$star_model = new star_model();
		    $star_model->exchange($row);
			$arr[] = $star_model;
		}
		
		return $arr;
	}
}
