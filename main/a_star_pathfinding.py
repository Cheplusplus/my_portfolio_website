from main.grid_object import Grid
import math


all_nodes = []
grid = None
path = []
obstacles = []


def setup(rows=512//8+1, cols=512//8+1):
    global grid

    grid = Grid(rows, cols)
    for row in range(len(grid.grid)):
        for col in range(len(grid.grid[0])):
            node = grid.grid[row][col]
            node.origin = None
            node.g_cost = 0
            node.h_cost = 0
            node.f_cost = 0
            node.has_been = False
            node.searched = False


# -------------------Setup the obstacles----------------------
def update_obstacles(new_obstacles):
    global obstacles
    obstacles = new_obstacles
    return obstacles

# -------------------Find lowest F cost-----------------------
def find_lowest_f_cost():
    lowest_f_cost = 999 ** 99
    this_node = 0
    for node in all_nodes:
        if not node.has_been and node.f_cost < lowest_f_cost:
            this_node = node
            lowest_f_cost = node.f_cost
    this_node.has_been = True
    return this_node


# -----------------------Update the nodes costs-----------------------
def update_costs(node, origin, end):
    # set new origin to update from----------------------------
    node.origin = origin

    # ----------------Distance from starting node--------------------------
    g_cost = int(distance_between(origin.coordinates, node.coordinates) * 9)
    if not node == origin:
        g_cost += origin.g_cost
    node.g_cost = int(g_cost)

    # -----------------Distance from ending node-------------------------
    h_cost = int(distance_between(end.coordinates, node.coordinates) * 10)
    node.h_cost = int(h_cost)

    # ----------------Combination of g and h costs------------------
    f_cost = node.g_cost + node.h_cost
    node.f_cost = f_cost
# --------------------------------------------------------------------


def search_neighbours(node, end):
    global obstacles
    for new_node in node.neighbours:
        if not new_node.has_been and new_node.coordinates not in obstacles:
            if not new_node.searched:
                update_costs(new_node, node, end)
                new_node.searched = True
                all_nodes.append(new_node)
            elif node.g_cost < new_node.origin.g_cost:
                update_costs(new_node, node, end)


# -------------------Reset nodes for next search-----------------------
def reset_nodes():
    global all_nodes
    global path

    for node in all_nodes:
        node.origin = None
        node.g_cost = 0
        node. h_cost = 0
        node.f_cost = 0
        node.has_been = False
        node.searched = False
    all_nodes = []
    path = []
# ---------------------------------------------------------------------


# -------------------Set the shortest path as this objects path-------------------
def get_path(node, start):
    global path
    """
    This method runs recursively and sets the shortest path as this objects path
    :param node:
    """
    if node.coordinates != start.coordinates:
        path.append(node.origin.coordinates)
        get_path(node.origin, start)
# ---------------------------------------------------------------------------------


def find_shortest_path(start, end):
    try:
        try:
            start = grid.grid[start['x']][start['y']]
            end = grid.grid[end['x']][end['y']]
        except:
            print('Cannot move here')
            return
        all_nodes.append(start)
        update_costs(start, start, end)
        while end not in all_nodes:
            node = find_lowest_f_cost()
            search_neighbours(node, end)
        get_path(all_nodes[-1], start)
        new_path = list(reversed(path))
        reset_nodes()
        return new_path
    except:
        reset_nodes()
        print("No Path")
        return

# ----------------------------------------------------------------------------------------------


def distance_between(p1, p2):
    d = math.sqrt((p2['x']-p1['x'])**2 + (p2['y'] - p1['y'])**2)
    return d


def main():
    setup()
    print(find_shortest_path({"x":5,"y":5, "start":False}, {"x":15,"y":15, "start":True}))



if __name__ == '__main__':
    main()
