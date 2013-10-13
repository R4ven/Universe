<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Star_model extends CI_Model
{
	/**
	 * int sid
	 */
	public $id;
	
	/**
	 * string name
	 */
	public $name;
	
	/**
	 * int galaxy_gid
	 */
	public $pid;
		
	/**
	 * coordinates
	 */
	public $coord = array();

	/**
	 * @param object params
	 */
	public function exchange($params) {
		
		//print_r($params);
		$this->id 			= is_numeric($params->id) ? $params->id : null;
		$this->pid 			= is_numeric($params->pid) ? $params->pid : null;
		$this->name 		= isset($params->name) ? $params->name : "unbekannt";
		
		$this->coord 		= array(
								'x' => is_numeric($params->x) ? $params->x : 0,
								'y' => is_numeric($params->y) ? $params->y : 0,
								'z' => is_numeric($params->z) ? $params->z : 0
							);
	}
	
	/**
	 * @return array
	 */
	public function getJson() {
		$system = array(
			"id"	=> $this->id,
			"pid"	=> $this->pid,
			"name"	=> $this->name,
			"coord"	=> array(
				"x"	=> $this->coord['x'],
				"y"	=> $this->coord['y'],
				"z"	=> $this->coord['z'],
			),
			"meshCoord" => array(
				"x" =>  $this->coord['x'],
				"y" =>  $this->coord['y'],
				"z" =>  $this->coord['z'],
			)
		);

		
		return $system;
	}
}
	