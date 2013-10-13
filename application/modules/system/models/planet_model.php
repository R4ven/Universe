<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Planet_model extends CI_Model
{
	/**
	 * int uid
	 */
	protected $uid;
	
	/**
	 * string name
	 */
	protected $name;
	
	/**
	 * int starSystem_sid
	 */
	protected $starSystem_sid;
	
	/**
	 * int radius
	 */
	protected $radius = 10;
	
	/**
	 * coordinates
	 */
	public $coord = array();
	
	public function exchange($params) {

		$this->uid 				= is_numeric($params->uid) ? $params->uid : null;
		$this->starSystem_sid 	= is_numeric($params->starSystem_sid) ? $params->starSystem_sid : null;
		$this->name 			= isset($params->name) ? $params->name : "unbekannt";
		
		$this->coord = array(
			'x' 	=> is_numeric($params->x) ? $params->x : 0,
			'y' 	=> is_numeric($params->y) ? $params->y : 0,
			'z' 	=> is_numeric($params->z) ? $params->z : 0
		);
		
	}
	
	public function getArray() {
		return array(
			"id"	=> $this->uid,
			"pid"	=> $this->starSystem_sid,
			"name"	=> $this->name,
			"radius" => $this->radius,
			"coord"	=> array(
				"x"	=> $this->coord['x'],
				"y"	=> $this->coord['y'],
				"z"	=> $this->coord['z'],
			)
		);
	}
}
	