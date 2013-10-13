<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Sunsystem_model extends CI_Model
{
	/**
	 * int sid
	 */
	public $sid;
	
	/**
	 * string name
	 */
	public $name;
	
	/**
	 * int galaxy_gid
	 */
	public $galaxy_gid;
	
	/**
	 * array planet_model
	 */
	public $planets = array();
	
	/**
	 * coordinates
	 */
	public $coord = array();

	/**
	 * @param object params
	 */
	public function exchange($params) {
		$this->load->model('planet_model');
		
		//print_r($params);
		$this->sid 			= is_numeric($params->sid) ? $params->sid : null;
		$this->galaxy_gid 	= is_numeric($params->galaxy_gid) ? $params->galaxy_gid : null;
		$this->name 		= isset($params->name) ? $params->name : "unbekannt";
		
		$this->coord 		= array(
								'x' => is_numeric($params->x) ? $params->x : 0,
								'y' => is_numeric($params->y) ? $params->y : 0,
								'z' => is_numeric($params->z) ? $params->z : 0
							);
		
		if(count($params->planets) > 0) {
			
			foreach($params->planets AS $key => $planet) {
				
				if($planet instanceof Planet_model) {
					$this->planets[] = $planet;
				}
			}
		}
		
	}
	
	/**
	 * @return array
	 */
	public function getJson() {
		$system = array(
			"id"	=> $this->sid,
			"pid"	=> $this->galaxy_gid,
			"name"	=> $this->name,
			"coord"	=> array(
				"x"	=> $this->coord['x'],
				"y"	=> $this->coord['y'],
				"z"	=> $this->coord['z'],
			),
			"planets" => array()
		);
		
		foreach($this->planets AS $key => $planet) {
			$p = $planet->getArray();
			$p["meshCoord"] = array(
				"x" =>  $planet->coord['x'] - $this->coord['x'],
				"y" =>  $planet->coord['y'] - $this->coord['y'],
				"z" =>  $planet->coord['z'] - $this->coord['z'],
			);
			$system["planets"][] = $p;
		}
		
		return $system;
	}
}
	