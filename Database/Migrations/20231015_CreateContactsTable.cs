using Microsoft.EntityFrameworkCore.Migrations;

public partial class CreateContactsTable : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.CreateTable(
            name: "Contacts",
            columns: table => new
            {
                Id = table.Column<int>(nullable: false)
                    .Annotation("SqlServer:Identity", "1, 1"),
                Name = table.Column<string>(type: "nvarchar(100)", nullable: false),
                Email = table.Column<string>(type: "nvarchar(100)", nullable: false),
                Message = table.Column<string>(type: "nvarchar(500)", nullable: false),
                CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                IsDeleted = table.Column<bool>(nullable: false, defaultValue: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_Contacts", x => x.Id);
            });

        migrationBuilder.CreateIndex(
            name: "IX_Contacts_Email",
            table: "Contacts",
            column: "Email");
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropTable(
            name: "Contacts");
    }
}