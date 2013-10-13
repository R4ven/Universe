<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Galaxygenerator_model extends CI_Model
{
	protected $galaxyId;
	
	protected $count;
	
	public function generateGalaxy($galaxyId, $count) {
		
		$this->galaxyId = $galaxyId;
		$this->count = $count;
		
		$query = $this->db->query('TRUNCATE TABLE galaxy');
		$query = $this->db->query('TRUNCATE TABLE starsystem');

		/*$query = $this->db->select_sum('gid')->where('gid', $galaxyId)->get('galaxy')->result();

		if($query[0]->gid) return false;*/
		
		//transaktion starten
		$this->db->trans_start(TRUE); // Query will be rolled back
		
		$data = array(
			   'gid' => $this->galaxyId,
			   'name' => 'Galaxy ' . $this->galaxyId,
			   'x' => 0,
			   'y' => 0,
			   'z' => 0
			);
		$this->db->insert('galaxy', $data); 
		
		$this->generateSystems();
			
		if($this->db->trans_complete()) {
			echo "erstellt";
		}
	}
	
	private function generateSystems() {
		rand(5, 15);
		$table = 'starsystem';
		
		$newID = $this->getLastInserted($table, 'id') + 1;
		$count = $this->count;
		//$steps = array()

		for($i=0; $i<$this->count; $i++) {

			$prozent = (100 / $count) * $i;
			
			if($prozent <= 20) {
				$maxX = 150; $maxY = 450; $maxZ = 150;
			} elseif($prozent > 20 && $prozent < 60) {
				$maxX = 350; $maxY = 350; $maxZ = 350;
			} else {
				$maxX = 450; $maxY = 250; $maxZ = 450;
			}
			
			$coords = $this->randCoords($maxX, $maxY, $maxZ);
			
			while($this->checkCoords($table, $coords['x'], $coords['y'], $coords['z'], 10) == false) {
				$coords = $this->randCoords($maxX, $maxY, $maxZ);
			}

			$data = array(
			   'pid' 			=> $this->galaxyId,
			   //'crdate' 		=> date('Y-m-d H:i:s'),
			   'name'			=> "System " . $newID,
			   'x'				=> $coords['x'],
			   'y'				=> $coords['y'],
			   'z'				=> $coords['z']
			);

			$this->db->insert($table, $data); 
			$newID = $this->db->insert_id() + 1;
			
			//$this->generatePlanets($this->db->insert(), rand(2,7));
		}	
	}
	
	private function randCoords($maxX = 450, $maxY = 250, $maxZ = 450) {
		return array( 	'x'=> rand($maxX * -1, $maxX),
						'y' => rand($maxY * -1, $maxY),
						'z' => rand($maxZ * -1, $maxZ));
	}
	
	/**
	 * @param $table table
	 * @return boolean
	 */
	
	private function checkCoords($table, $x, $y, $z, $radius) {
		$x_s = $x - $radius;
		$x_l = $x + $radius;
		$y_s = $y - $radius;
		$y_l = $y + $radius;
		$z_s = $z - $radius;
		$z_l = $z + $radius;
		//
		$sql = "SELECT * FROM " . $table . " WHERE (x BETWEEN ".$x_s." AND ".$x_l.") AND (y BETWEEN ".$y_s." AND ".$y_l.") AND (z BETWEEN ".$z_s." AND ".$z_l.")";
		$result = $this->db->query($sql)->result();
		
		if(count($result) > 0) return false;
		else return true;
	}
	
	private function  getLastInserted($table, $id) {
		$this->db->select_max($id);
		$Q = $this->db->get($table);
		$row = $Q->row_array();
		return $row[$id];
	 }
}
	